import io from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

import SOCKET_URL from "config";

export default () => {
    const socket = io(SOCKET_URL);

    let uuid = localStorage.getItem('uuid');
    if (!uuid) {
        uuid = uuidv4();
        localStorage.setItem('uuid', uuid);
    }

    socket.on('connect', () => {
        console.log('Connected');
    });

    function login(username, cb) {
        socket.emit('login', {
            uuid,
            username
        }, cb);
    }

    return {
        login
    }
}
