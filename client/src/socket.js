import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { Event } from 'lib';

export default () => {
    let token = localStorage.getItem('nanoitall-token');
    if (!token) {
        token = uuidv4();
        localStorage.setItem('nanoitall-token', token);
    }

    let url = 'http://localhost:3001';
    if (process.env.NODE_ENV === 'production') {
        url = window.location.href;
    }

    const socket = io(url, { query: `token=${token}` });
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

    function getChat() {
        socket.emit(Event.C2S.GET_CHAT);
    }

    function newChat(message) {
        socket.emit(Event.C2S.NEW_CHAT, message);
    }

    function submitAnswer(answer) {
        socket.emit(Event.C2S.SUBMIT_ANSWER, answer);
    }

    return {
        Events: Event.S2C,
        registerHandler,
        unregisterHandler,
        loginAddress,
        loginName,
        loginPassword,
        logout,
        getChat,
        newChat,
        submitAnswer
    }
}
