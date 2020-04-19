const server = require('http').createServer();
const io = module.exports.io = require('socket.io')(server);

const socket = require('./socket');
io.on('connection', socket);

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
