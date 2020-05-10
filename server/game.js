const Scheduler = require('./scheduler');
const State = require('./state');
const Phase = require('../lib/phase');
const io = require('./index').io;

module.exports = class Game {

    constructor() {
        this.state = new State();
        this.softUpdate = false;

        // Start the scheduler responsible for phase changes
        this.scheduler = new Scheduler((phase, phaseEndDate) => {
            this.updatePhase(phase, phaseEndDate);
        });

        // Periodically broadcast non-critical state updates (e.g. num online)
        setInterval(() => {
            if (this.softUpdate) {
                this.broadcastState();
            }
        }, 2000);
    }

    // Returns the game state
    getState() {
        // Update phase time left before returning
        const nowTime = new Date().getTime();
        const endTime = this.state.phaseEndDate.getTime();
        this.state.phaseRemainingTimeMs = endTime - nowTime;
        return this.state;
    }

    // Emit state change
    broadcastState() {
        console.log(`New state: ${JSON.stringify(this.state)}`);
        io.emit('state', this.getState());
        this.softUpdate = false;
    }

    updatePhase(phase, phaseEndDate) {
        console.log(`Phase change: ${this.state.phase} -> ${phase}`);
        this.state.phase = phase;
        this.state.phaseEndDate = phaseEndDate;

        if (phase === Phase.round) {
            this.state.round++;
        } else if (phase == Phase.question) {
            this.state.question++;
        }

        this.broadcastState();
    }

    // Set the number of online connections
    updateOnline() {
        this.state.online = io.engine.clientsCount;
        this.softUpdate = true;
    }
}
