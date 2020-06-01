const bcrypt = require('bcrypt');
const models = require('./models');
const io = require('./index').io;

module.exports = class Session {

    // New connection established. Search for their token so we can restore
    // their session if it's available. For example, we'll need to restore
    // the session when the user refreshes the page.
    constructor(sid, token, cb) {
        this.account = null;
        this.sid = sid;
        this.token = token;
        this.cb = cb;

        models.Account.findOne({
            where: { token }
        }).then((account) => {
            if (account === null) {
                // No account associated with this token so make them log in.
                this.cb.onLogoutSuccess();
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
            this.cb.onAddressError('Invalid Nano address format');
            return;
        }

        // Check again for an existing connection with this token. The user
        // could have joined in another tab since this socket had connected.
        let account = await models.Account.findOne({
            where: { token: this.token }
        });
        if (account && account.sid) {
            this.cb.onLoginDuplicate();
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
                        this.cb.onPasswordError(err);
                    } else if (res) {
                        // Passwords matched
                        this.finishLogin(account);
                    } else {
                        // Passwords didn't match
                        this.cb.onPasswordError('Incorrect password');
                    }
                });
            } else {
                this.cb.onLoginVerify(account);
            }
        } else {
            this.loginExistingAccount(account);
        }
    }

    // Set the name of this account. Check the socket id to make sure
    // this connection is authorized.
    setName(address, name) {
        name = name.length > 16 ? name.substr(0, 16) : name;
        models.Account.findOne({
            where: {
                address,
                sid: this.sid
            }
        }).then((account) => {
            if (account) {
                account.name = name;
                this.finishLogin(account);
            }
        });
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
                    this.cb.onLoginDuplicate();
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
        account.save().then(() => {
            this.account = account;
            this.cb.onLoginSuccess(account);
        });
    }

    // Unlink the current account from this socket and user token (frees it
    // to be used by other tabs or devices).
    logout() {
        this.account.sid = null;
        this.account.token = null;
        this.account.save();
        this.account = null;
        this.cb.onLogoutSuccess();
    }

    // Socket is about to close (e.g. browser closed), so unlink the account
    // from this socket.
    disconnect() {
        this.account.sid = null;
        this.account.save();
    }
}
