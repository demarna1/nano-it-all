import io from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import { Event } from 'lib';
import SOCKET_URL from "config";

export default () => {
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
        socket.emit(Event.C2S.LOGIN_ADDRESS, address);
    }

    function loginPassword(address, password) {
        socket.emit(Event.C2S.LOGIN_PASSWORD, {address, password});
    }

    function loginName(address, name) {
        socket.emit(Event.C2S.LOGIN_NAME, {address, name});
    }

    function logout() {
        socket.emit(Event.C2S.LOGOUT);
    }

    function newChat(address, message) {
        socket.emit(Event.C2S.NEW_CHAT, {address, message});
    }

    return {
        Events: Event.S2C,
        registerHandler,
        unregisterHandler,
        loginAddress,
        loginName,
        loginPassword,
        logout,
        newChat
    }
}
