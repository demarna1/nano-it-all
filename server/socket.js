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
        player = game.scorekeeper.connectPlayer(account);
        socket.emit(S2C.LOGIN_SUCCESS, {
            gameState: game.getState(),
            playerState: player
        });
    }

    onLoginVerify = (account) => {
        socket.emit(S2C.LOGIN_VERIFY, {
            gameState: game.getState(),
            address: account.address,
            name: account.name
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

    // Connections below this must be checked to have a valid session
    // before performing any operations on game state.

    socket.on(C2S.LOGOUT, () => {
        if (socket.session.account) {
            game.scorekeeper.disconnectPlayer(socket.session.account);
            socket.session.logout();
        }
    });

    socket.on(C2S.NEW_CHAT, ({address, message}) => {
        if (socket.session.account) {
            io.emit(S2C.CHAT_MESSAGE, ({address, message}));
        }
    });

    socket.on(C2S.SUBMIT_ANSWER, (answer) => {
        if (socket.session.account) {
            game.addAnswer(socket.session.account, answer);
        }
    });

    socket.on('disconnect', () => {
        game.updateOnline();
        if (socket.session.account) {
            game.scorekeeper.disconnectPlayer(socket.session.account);
            socket.session.disconnect();
        }
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
