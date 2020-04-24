const models = require('./models');

module.exports = class Session {

    // New connection established. Search for their token so we can restore
    // their session if it's available. For example, we'll need to restore
    // the session when the user refreshes the page.
    constructor(sid, token, onLoginSuccess, onLoginError,
        onLoginDuplicate, onLogoutSuccess) {

        this.account = null;
        this.sid = sid;
        this.token = token;
        this.onLoginSuccess = onLoginSuccess;
        this.onLoginError = onLoginError;
        this.onLoginDuplicate = onLoginDuplicate;
        this.onLogoutSuccess = onLogoutSuccess;

        models.Account.findOne({
            where: { token }
        }).then((account) => {
            if (account === null) {
                // No account associated with this token so make them log in.
                this.onLogoutSuccess();
            } else if (account.sid) {
                // There's already a connection with this token so let them know.
                // This can happen when a user opens a 2nd tab in the same browser.
                this.onLoginDuplicate();
            } else {
                // Restore the user's session.
                console.log(`${account.name} connection restored`);
                account.sid = sid;
                account.save();
                this.account = account;
                this.onLoginSuccess(account);
            }
        });
    }

    login = async (address, name) => {
        // Normalize data sent from the client.
        address = address.toLowerCase();
        name = name.substr(0, 12);

        // Check the format of the nano address.
        const nanoRegex = /^(nano|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/;
        if (!nanoRegex.test(address)) {
            this.onLoginError('Invalid Nano address format');
            return;
        }

        // Check again for an existing connection with this token. Someone
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
            models.Account.create({
                address,
                name,
                verified: false,
                password: null,
                sid: this.sid,
                token: this.token,
                expiresAt: new Date(new Date() + 24 * 60 * 60 * 1000)
            }).then((account) => {
                console.log(`${account.name} joined with new account`);
                this.account = account;
                this.onLoginSuccess(account);
            });
        } else {
            if (account.verified) {
                // Account found but authentication required (not yet implemented).
                this.onLoginError('Authentication required');
            } else if (account.token) {
                // This account is being actively used by a different user token.
                this.onLoginError('Nano address already in use');
            } else {
                // User will be logged in to their existing account.
                account.sid = this.sid;
                account.token = this.token;
                account.expiresAt = new Date(new Date() + 24 * 60 * 60 * 1000);
                account.save();
                console.log(`${account.name} joined with existing account`);
                this.account = account;
                this.onLoginSuccess(account);
            }
        }
    }

    logout = () => {
        // Unlink the current account from this socket and user token (frees
        // it to be used by other tabs or devices).
        this.account.sid = null;
        this.account.token = null;
        this.account.save();
        console.log(`${this.account.name} left`);
        this.account = null;
        this.onLogoutSuccess();
    }

    disconnect = () => {
        // Socket is about to close (e.g. browser closed), so unlink the
        // account from this socket.
        if (this.account) {
            this.account.sid = null;
            this.account.save();
        }
    }
}
