const {Phase,Subphase} = require('../../lib/phase');

module.exports = class State {

    constructor() {
        this.online = 0;
        this.nanopot = 0;
        this.phase = Phase.pregame;
        this.subphase = Subphase.round;
        this.phaseEndDate = null;
        this.phaseRemainingTimeMs = 0;
        this.round = 0;
        this.question = 0;
        this.leaderboard = [];
        this.data = {}
    }
}
