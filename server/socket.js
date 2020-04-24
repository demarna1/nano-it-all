const io = require('./index').io;
const Session = require('./session');

module.exports = function(socket) {

    onLoginSuccess = (account) => {
        socket.emit('login.success', account);
    }

    onLoginError = (error) => {
        socket.emit('login.error', error);
    }

    onLoginDuplicate = () => {
        socket.emit('login.duplicate');
    }

    onLogoutSuccess = () => {
        socket.emit('logout.success');
    }

    socket.on('login', (data) => {
        socket.session.login(data.address, data.name);
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
        onLoginSuccess,
        onLoginError,
        onLoginDuplicate,
        onLogoutSuccess
    );
}
