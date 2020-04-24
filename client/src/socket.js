import io from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

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

    function registerLoginSuccessHandler(cb) {
        socket.on('login.success', cb);
    }

    function unregisterLoginSuccessHandler(cb){
        socket.off('login.success', cb);
    }

    function registerLoginErrorHandler(cb) {
        socket.on('login.error', cb);
    }

    function unregisterLoginErrorHandler(cb) {
        socket.off('login.error', cb);
    }

    function registerLogoutSuccessHandler(cb) {
        socket.on('logout.success', cb);
    }

    function unregisterLogoutSuccessHandler(cb) {
        socket.off('logout.success', cb);
    }

    function registerLoginDuplicateHandler(cb) {
        socket.on('login.duplicate', cb);
    }

    function unregisterLoginDuplicateHandler(cb) {
        socket.off('login.duplicate', cb);
    }

    function login(address, name) {
        socket.emit('login', {
            token,
            address,
            name
        });
    }

    function logout() {
        socket.emit('logout');
    }

    return {
        registerLoginSuccessHandler,
        unregisterLoginSuccessHandler,
        registerLoginErrorHandler,
        unregisterLoginErrorHandler,
        registerLogoutSuccessHandler,
        unregisterLogoutSuccessHandler,
        registerLoginDuplicateHandler,
        unregisterLoginDuplicateHandler,
        login,
        logout
    }
}
