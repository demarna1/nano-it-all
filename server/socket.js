const io = require('./index').io;
const models = require('./models');

module.exports = function(socket) {
    const token = socket.handshake.query.token;
    console.log(`${socket.id} connected with token ${token}`);

    models.Account.findOne({
        where: { token }
    }).then((account) => {
        if (account === null) {
            socket.account = null;
            socket.emit('logout.success');
        } else {
            console.log(`${account.name} joined with existing session`);
            socket.account = account;
            socket.emit('login.success', account);
        }
    });

    socket.on('login', async (data) => {
        let {token, address, name} = data;

        token = token.toLowerCase();
        address = address.toLowerCase();
        name = name.substr(0, 12);

        const nanoRegex = /^(nano|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/;
        if (!nanoRegex.test(address)) {
            socket.emit('login.error', 'Invalid Nano address format');
            return;
        }

        let account = await models.Account.findOne({ where: {address} });
        if (account !== null) {
            if (account.verified) {
                socket.emit('login.error', 'Authentication required');
            } else {
                socket.emit('login.error', 'Nano address already in use');
            }
            return;
        }

        models.Account.create({
            address,
            token,
            name
        }).then((account) => {
            console.log(`${account.name} joined with new session`);
            socket.account = account;
            socket.emit('login.success', account);
        });
    });

    socket.on('logout', () => {
        models.Account.destroy({
            where: { address: socket.account.address }
        }).then(() => {
            console.log(`${socket.account.name} left`);
            socket.account = null;
            socket.emit('logout.success');
        });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    });
}
