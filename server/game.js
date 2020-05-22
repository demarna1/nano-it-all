const Phase = require('../lib/phase');
const Player = require('./player');
const QReader = require('./qreader');
const Scheduler = require('./scheduler');
const State = require('./state');
const io = require('./index').io;

module.exports = class Game {

    constructor() {
        this.state = new State();
        this.players = {};
        this.qReader = new QReader();
        this.softUpdate = false;

        // Start the scheduler responsible for phase changes
        this.scheduler = new Scheduler((phase, phaseEndDate, round, question) => {
            this.updatePhase(phase, phaseEndDate, round, question);
            this.broadcastState();
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

    updatePhase(phase, phaseEndDate, round, question) {
        this.state.phase = phase;
        this.state.phaseEndDate = phaseEndDate;
        this.state.round = round;
        this.state.question = question;

        if (phase == Phase.question) {
            this.state.data = this.qReader.nextQuestion(this.state.round);
        }
    }

    // Set the number of online connections
    updateOnline() {
        this.state.online = io.engine.clientsCount;
        this.softUpdate = true;
    }

    addPlayer(account) {
        if (this.players.hasOwnProperty(account.id)) {
            this.players[account.id].sid = account.sid;
        } else {
            this.players[account.id] = new Player(account);
        }
    }

    removePlayer(account) {
        delete this.players[account.id];
    }

    disconnectPlayer(account) {
        this.players[account.id].sid = null;
    }

    recordAnswer(account, answer, onReponse) {
        const right = this.qReader.isRightAnswer(answer);
        onReponse({answer, right});
    }
}
