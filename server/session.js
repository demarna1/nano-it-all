const bcrypt = require('bcrypt');
const models = require('./models');
const io = require('./index').io;

module.exports = class Session {

    // New connection established. Search for their token so we can restore
    // their session if it's available. For example, we'll need to restore
    // the session when the user refreshes the page.
    constructor(sid, token, onAddressError, onPasswordError, onLoginSuccess,
        onLoginVerify, onLoginDuplicate, onLogoutSuccess) {

        this.account = null;
        this.sid = sid;
        this.token = token;
        this.onAddressError = onAddressError;
        this.onPasswordError = onPasswordError;
        this.onLoginSuccess = onLoginSuccess;
        this.onLoginVerify = onLoginVerify;
        this.onLoginDuplicate = onLoginDuplicate;
        this.onLogoutSuccess = onLogoutSuccess;

        models.Account.findOne({
            where: { token }
        }).then((account) => {
            if (account === null) {
                // No account associated with this token so make them log in.
                this.onLogoutSuccess();
            } else {
                // Existing account found for this token
                this.loginExistingAccount(account);
            }
        });
    }

    // Handle authentication and account provisioning
    async login(address, password) {
        address = address.toLowerCase();

        // Check the format of the nano address.
        const nanoRegex = /^(nano|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/;
        if (!nanoRegex.test(address)) {
            this.onAddressError('Invalid Nano address format');
            return;
        }

        // Check again for an existing connection with this token. The user
        // could have joined in another tab since this socket had connected.
        let account = await models.Account.findOne({
            where: { token: this.token }
        });
        if (account && account.sid) {
            this.onLoginDuplicate();
            return;
        }

        account = await models.Account.findOne({ where: {address} });
        if (account === null) {
            // Nano address not found, so create a new account.
            const account = models.Account.build({
                address,
                name: null,
                verified: false,
                password: null
            });
            this.finishLogin(account);
        } else if (account.verified) {
            // Account found but extra authentication required.
            if (password) {
                bcrypt.compare(password, account.password, (err, res) => {
                    if (err) {
                        this.onPasswordError(err);
                    } else if (res) {
                        // Passwords matched
                        this.finishLogin(account);
                    } else {
                        // Passwords didn't match
                        this.onPasswordError('Incorrect password');
                    }
                });
            } else {
                this.onLoginVerify(account);
            }
        } else {
            this.loginExistingAccount(account);
        }
    }

    // If there's already a connection associated this token, check the
    // list of clients to see if it's still active. Otherwise, log in.
    loginExistingAccount(account) {
        if (account.sid) {
            io.clients((err, clients) => {
                if (err) throw err;
                if (clients.indexOf(account.sid) > -1) {
                    // Account already has a session (e.g. user opened a second tab),
                    // so reject the login.
                    this.onLoginDuplicate();
                } else {
                    // Socket was orphaned (e.g. server restarted while connected),
                    // so overwrite the session and log in.
                    this.finishLogin(account);
                }
            });
        } else {
            // Restore the user's session
            this.finishLogin(account);
        }
    }

    // Log the user into their account and refresh the session details.
    finishLogin(account) {
        account.sid = this.sid;
        account.token = this.token;
        account.save();
        this.account = account;
        this.onLoginSuccess(account);
    }

    // Unlink the current account from this socket and user token (frees it
    // to be used by other tabs or devices).
    logout() {
        this.account.sid = null;
        this.account.token = null;
        this.account.save();
        this.account = null;
        this.onLogoutSuccess();
    }

    // Socket is about to close (e.g. browser closed), so unlink the account
    // from this socket.
    disconnect() {
        if (this.account) {
            this.account.sid = null;
            this.account.save();
        }
    }
}
