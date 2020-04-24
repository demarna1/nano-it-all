const io = require('./index').io;
const models = require('./models');

module.exports = function(socket) {

    // New connection established. Check the token to restore their session
    // if it's available (perhaps they refreshed the page or were temporarily
    // disconnected).
    models.Account.findOne({
        where: { token: socket.handshake.query.token }
    }).then((account) => {
        if (account === null) {
            // No account associated with this token so make them log in.
            socket.account = null;
            socket.emit('logout.success');
        } else if (account.sid) {
            // There's already a connection with this token so let them know.
            // This can happen when a user opens a 2nd tab in the same browser.
            socket.account = null;
            socket.emit('login.duplicate');
        } else {
            // Restore the user's session.
            console.log(`${account.name} connection restored`);
            account.sid = socket.id;
            account.save();
            socket.account = account;
            socket.emit('login.success', account);
        }
    });

    socket.on('login', async (data) => {
        // Normalize data sent from the client.
        let {token, address, name} = data;
        token = token.toLowerCase();
        address = address.toLowerCase();
        name = name.substr(0, 12);

        // Check the format of the nano address.
        const nanoRegex = /^(nano|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/;
        if (!nanoRegex.test(address)) {
            socket.emit('login.error', 'Invalid Nano address format');
            return;
        }

        // Check again for an existing connection with this token. Someone
        // could have joined in another tab since this socket had connected.
        let account = await models.Account.findOne({
            where: { token }
        });
        if (account && account.sid) {
            socket.emit('login.duplicate');
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
                sid: socket.id,
                token,
                expiresAt: new Date(new Date() + 24 * 60 * 60 * 1000)
            }).then((account) => {
                console.log(`${account.name} joined with new account`);
                socket.account = account;
                socket.emit('login.success', account);
            });
        } else {
            if (account.verified) {
                // Account found but authentication required (not yet implemented).
                socket.emit('login.error', 'Authentication required');
            } else if (account.token) {
                // This account is being actively used by a different user token.
                socket.emit('login.error', 'Nano address already in use');
            } else {
                // User will be logged in to their existing account.
                account.sid = socket.id;
                account.token = token;
                account.expiresAt = new Date(new Date() + 24 * 60 * 60 * 1000);
                account.save();
                console.log(`${account.name} joined with existing account`);
                socket.account = account;
                socket.emit('login.success', account);
            }
        }
    });

    socket.on('logout', () => {
        // Unlink the current account from this socket and user token (frees
        // it to be used by other tabs or devices).
        const {account} = socket;
        account.sid = null;
        account.token = null;
        account.save();
        console.log(`${account.name} left`);
        socket.account = null;
        socket.emit('logout.success');
    });

    socket.on('disconnect', () => {
        // Socket is about to close (e.g. browser closed), so unlink the
        // account from this socket.
        if (socket.account) {
            const {account} = socket;
            account.sid = null;
            account.save();
        }
    });
}
