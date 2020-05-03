const State = require('./state');
const io = require('./index').io;

module.exports = class Game {

    constructor() {
        this.state = new State();
        this.dirty = true;

        setInterval(() => {
            if (this.dirty) {
                console.log(`new state: ${JSON.stringify(this.state)}`);
                io.emit('state', this.state);
                this.dirty = false;
            }
        }, 1000);
    }

    updateOnline = () => {
        this.state.online = io.engine.clientsCount;
        this.dirty = true;
    }
}
