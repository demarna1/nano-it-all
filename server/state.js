const Phase = require('../lib/phase');

module.exports = class State {

    constructor() {
        this.online = 0;
        this.phase = Phase.pregame;
        this.phaseEndDate = null;
        this.phaseTimeLeftMs = 0;
    }
}
