const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = module.exports.io = require('socket.io')(server);

const Game = require('./game');
module.exports.game = new Game();

const socket = require('./socket');
io.on('connection', socket);

if (process.env.NODE_ENV === 'production') {
    // Serve static files
    const path = require('path');
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Handle React routing, return all requests to client app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
