const Scheduler = require('./scheduler');
const State = require('./state');
const io = require('./index').io;

module.exports = class Game {

    constructor() {
        this.state = new State();
        this.dirty = false;

        this.scheduler = new Scheduler((phase, phaseEndDate) => {
            console.log(`Phase change: ${this.state.phase} -> ${phase}`);
            this.state.phase = phase;
            this.state.phaseEndDate = phaseEndDate;
            this.dirty = true;
        });

        setInterval(() => {
            if (this.dirty) {
                // Update phase time left
                const nowTime = new Date().getTime();
                const endTime = this.state.phaseEndDate.getTime();
                this.state.phaseTimeLeftMs = endTime - nowTime;

                // Emit state change
                console.log(`New state: ${JSON.stringify(this.state)}`);
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
