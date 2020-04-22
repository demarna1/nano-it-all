import io from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

import SOCKET_URL from "config";

export default () => {
    const socket = io(SOCKET_URL);

    let token = localStorage.getItem('nanoitall-token');
    if (!token) {
        token = uuidv4();
        localStorage.setItem('nanoitall-token', token);
    }

    socket.on('connect', () => {
        console.log('Connected');
    });

    function login(address, name, cb) {
        socket.emit('login', {
            token,
            address,
            name
        }, cb);
    }

    return {
        login
    }
}
