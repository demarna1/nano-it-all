const Session = require('./session');

module.exports = function(socket) {

    onAddressError = (error) => {
        socket.emit('address.error', error);
    }

    onPasswordError = (error) => {
        socket.emit('password.error', error);
    }

    onLoginSuccess = (account) => {
        socket.emit('login.success', account);
    }

    onLoginVerify = (account) => {
        socket.emit('login.verify', account);
    }

    onLoginDuplicate = () => {
        socket.emit('login.duplicate');
    }

    onLogoutSuccess = () => {
        socket.emit('logout.success');
    }

    socket.on('login.address', (address) => {
        socket.session.login(address, null);
    });

    socket.on('login.name', ({address, name}) => {
        socket.session.setName(address, name);
    });

    socket.on('login.password', ({address, password}) => {
        socket.session.login(address, password);
    });

    socket.on('logout', () => {
        socket.session.logout();
    });

    socket.on('disconnect', () => {
        socket.session.disconnect();
    });

    socket.session = new Session(
        socket.id,
        socket.handshake.query.token,
        {
            onAddressError,
            onPasswordError,
            onLoginSuccess,
            onLoginVerify,
            onLoginDuplicate,
            onLogoutSuccess
        }
    );
}
