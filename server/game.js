const Scheduler = require('./scheduler');
const State = require('./state');
const io = require('./index').io;

module.exports = class Game {

    constructor() {
        this.state = new State();
        this.softUpdate = false;

        // Start the scheduler responsible for phase changes
        this.scheduler = new Scheduler(this.updatePhase);

        // Periodically send out non-critical state updates (e.g. num online)
        setInterval(() => {
            if (this.softUpdate) {
                this.broadcastState();
            }
        }, 5000);
    }

    broadcastState = () => {
        // Update phase time left
        const nowTime = new Date().getTime();
        const endTime = this.state.phaseEndDate.getTime();
        this.state.phaseRemainingTimeMs = endTime - nowTime;

        // Emit state change
        console.log(`New state: ${JSON.stringify(this.state)}`);
        io.emit('state', this.state);
        this.softUpdate = false;
    }

    updatePhase = (phase, phaseEndDate) => {
        console.log(`Phase change: ${this.state.phase} -> ${phase}`);
        this.state.phase = phase;
        this.state.phaseEndDate = phaseEndDate;
        this.broadcastState();
    }

    updateOnline = () => {
        this.state.online = io.engine.clientsCount;
        this.softUpdate = true;
    }
}
