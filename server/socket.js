const { S2C, C2S } = require('../lib/event');
const Session = require('./session');
const game = require('./index').game;
const io = require('./index').io;

module.exports = function(socket) {

    // New socket connection
    game.updateOnline();

    onAddressError = (error) => {
        socket.emit(S2C.ADDRESS_ERROR, error);
    }

    onPasswordError = (error) => {
        socket.emit(S2C.PASSWORD_ERROR, error);
    }

    onLoginSuccess = (account) => {
        socket.emit(S2C.LOGIN_SUCCESS, {
            gameState: game.getState(),
            account
        });
    }

    onLoginVerify = (account) => {
        socket.emit(S2C.LOGIN_VERIFY, {
            gameState: game.getState(),
            account
        });
    }

    onLoginDuplicate = () => {
        socket.emit(S2C.LOGIN_DUPLICATE, game.getState());
    }

    onLogoutSuccess = () => {
        socket.emit(S2C.LOGOUT_SUCCESS, game.getState());
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

    socket.on(C2S.NEW_CHAT, ({address, message}) => {
        io.emit(S2C.CHAT_MESSAGE, ({address, message}));
    });

    socket.on(C2S.SUBMIT_ANSWER, (answer) => {
        console.log(`Received answer ${answer} from ${socket.id}`);
    });

    socket.on('disconnect', () => {
        game.updateOnline();
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
