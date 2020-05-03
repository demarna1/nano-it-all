import io from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

import SOCKET_URL from "config";

export default () => {

    const EventsFromServer = Object.freeze({
        ADDRESS_ERROR: "address.error",
        PASSWORD_ERROR: "password.error",
        LOGIN_DUPLICATE: "login.duplicate",
        LOGIN_SUCCESS: "login.success",
        LOGIN_VERIFY: "login.verify",
        LOGOUT_SUCCESS: "logout.success",
        STATE_CHANGE: "state"
    });

    const EventsToServer = Object.freeze({
        LOGIN_ADDRESS: "login.address",
        LOGIN_PASSWORD: "login.password",
        LOGOUT: "logout"
    });

    let token = localStorage.getItem('nanoitall-token');
    if (!token) {
        token = uuidv4();
        localStorage.setItem('nanoitall-token', token);
    }

    const socket = io(SOCKET_URL, { query: `token=${token}` });
    socket.on('connect', () => {
        console.log('SIO connection established');
    });

    function registerHandler(event, cb) {
        socket.on(event, cb);
    }

    function unregisterHandler(event, cb) {
        socket.off(event, cb);
    }

    function loginAddress(address) {
        socket.emit(EventsToServer.LOGIN_ADDRESS, address);
    }

    function loginPassword(address, password) {
        socket.emit(EventsToServer.LOGIN_PASSWORD, {address, password});
    }

    function logout() {
        socket.emit(EventsToServer.LOGOUT);
    }

    return {
        Events: EventsFromServer,
        registerHandler,
        unregisterHandler,
        loginAddress,
        loginPassword,
        logout
    }
}
