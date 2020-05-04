const Scheduler = require('./scheduler');
const State = require('./state');
const io = require('./index').io;

module.exports = class Game {

    constructor() {
        this.state = new State();
        this.dirty = false;

        this.scheduler = new Scheduler((phase, phaseLengthMs) => {
            console.log(`Phase change: ${this.state.phase} -> ${phase}`);
            console.log(`Next phase in ${phaseLengthMs} milliseconds`);
            this.state.phase = phase;
            this.state.phaseLengthMs = phaseLengthMs;
            this.dirty = true;
        });

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
