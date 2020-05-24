const { S2C } = require('../lib/event');
const Phase = require('../lib/phase');
const QReader = require('./qreader');
const Scheduler = require('./scheduler');
const Scorekeeper = require('./scorekeeper');
const State = require('./state');
const io = require('./index').io;

module.exports = class Game {

    constructor() {
        this.state = new State();
        this.qReader = new QReader();
        this.scorekeeper = new Scorekeeper();
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

    // Returns time left in phase (in milliseconds)
    getPhaseTimeRemainingMs() {
        const nowTime = new Date().getTime();
        const endTime = this.state.phaseEndDate.getTime();
        return endTime - nowTime;
    }

    // Returns the game state
    getState() {
        // Update phase time left before returning
        this.state.phaseRemainingTimeMs = this.getPhaseTimeRemainingMs();
        return this.state;
    }

    // Emit game state change
    broadcastState() {
        console.log(`New state: ${JSON.stringify(this.state)}`);
        io.emit(S2C.STATE_CHANGE, this.getState());
        this.softUpdate = false;
    }

    // Emit player state change
    emitPlayerState(player) {
        if (player.sid) {
            io.to(player.sid).emit(S2C.PLAYER_CHANGE, player);
        }
    }

    updatePhase(phase, phaseEndDate, round, question) {
        this.state.phase = phase;
        this.state.phaseEndDate = phaseEndDate;
        this.state.round = round;
        this.state.question = question;

        if (phase == Phase.question) {
            this.state.data = this.qReader.nextQuestion(this.state.round);
            this.scorekeeper.resetAnswers(this.state.round, this.emitPlayerState);
        }
    }

    // Set the number of online connections
    updateOnline() {
        this.state.online = io.engine.clientsCount;
        this.softUpdate = true;
    }

    submitAnswer(account, answer) {
        const right = this.qReader.isRightAnswer(answer);
        const timeRemaining = Math.ceil(this.getPhaseTimeRemainingMs() / 1000);
        const player = this.scorekeeper.addAnswer(account, answer, right, timeRemaining);
        this.emitPlayerState(player);
    }
}
