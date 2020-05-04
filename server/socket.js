const { S2C, C2S } = require('../lib/event');
const Session = require('./session');

module.exports = function(socket) {

    onAddressError = (error) => {
        socket.emit(S2C.ADDRESS_ERROR, error);
    }

    onPasswordError = (error) => {
        socket.emit(S2C.PASSWORD_ERROR, error);
    }

    onLoginSuccess = (account) => {
        socket.emit(S2C.LOGIN_SUCCESS, account);
    }

    onLoginVerify = (account) => {
        socket.emit(S2C.LOGIN_VERIFY, account);
    }

    onLoginDuplicate = () => {
        socket.emit(S2C.LOGIN_DUPLICATE);
    }

    onLogoutSuccess = () => {
        socket.emit(S2C.LOGOUT_SUCCESS);
    }

    socket.on(C2S.LOGIN_ADDRESS, (address) => {
        socket.session.login(address, null);
    });

    socket.on(C2S.LOGIN_NAME, ({address, name}) => {
        socket.session.setName(address, name);
    });

    socket.on(C2S.LOGIN_PASSWORD, ({address, password}) => {
        socket.session.login(address, password);
    });

    socket.on(C2S.LOGOUT, () => {
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
