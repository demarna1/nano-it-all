const io = require('./index').io;

module.exports = function(client) {
    console.log(`${client.id} connected`);

    client.on('login', (data, callback) => {
        console.log(`${data.uuid} logged in`);
        callback(null);
    });

    client.on('disconnect', () => {
        console.log(`${client.id} disconnected`);
    });
}
