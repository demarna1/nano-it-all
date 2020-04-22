const io = require('./index').io;
const models = require('./models');

module.exports = function(client) {
    console.log(`${client.id} connected`);

    client.on('login', (data, callback) => {
        const {token, address, name} = data;

        //if (address in state.users) {
            //callback('Nano address already in use');
            //return;
        //}

        //const username = name.substr(0, 12);

        const nanoRegex = /^(nano|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/;
        if (!nanoRegex.test(address)) {
            callback('Invalid Nano address format');
            return;
        }

        models.Account.create({
            address,
            token,
            name
        });

        console.log(`${name} joined with address ${address}, token ${token}`);
        callback(null);
    });

    client.on('disconnect', () => {
        console.log(`${client.id} disconnected`);
    });
}
