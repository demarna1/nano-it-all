const {S2C} = require('../../lib/event');
const {Phase, Subphase} = require('../../lib/phase');
const NanoAwarder = require('./nanoawarder');
const QReader = require('./qreader');
const Scheduler = require('./scheduler');
const Scorekeeper = require('./scorekeeper');
const State = require('./state');
const io = require('../index').io;

module.exports = class Game {

    constructor() {
        this.state = new State();
        this.qReader = new QReader();
        this.scorekeeper = new Scorekeeper();
        this.softUpdate = false;

        // Set the Nano pot size
        this.nanoAwarder = new NanoAwarder((kraiPot) => {
            this.state.kraiPot = kraiPot;
            this.softUpdate = true;
        });

        // Start the scheduler responsible for phase changes
        this.scheduler = new Scheduler((phase, subphase, phaseEndDate, round, question) => {
            this.updatePhase(phase, subphase, phaseEndDate, round, question);
            this.broadcastState();
        });

        // Periodically broadcast non-critical state updates (e.g. num online)
        setInterval(() => {
            if (this.softUpdate) {
                this.broadcastState();
            }
        }, 2000);
    }

    // Returns time left in phase or subphase (in milliseconds)
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

    // Update the game state phase
    updatePhase(phase, subphase, phaseEndDate, round, question) {
        this.state.phase = phase;
        this.state.subphase = subphase;
        this.state.phaseEndDate = phaseEndDate;
        this.state.round = round;
        this.state.question = question;

        if (phase == Phase.starting) {
            this.state.leaderboard = this.scorekeeper.resetGame(this.emitPlayerState);
        } else if (phase === Phase.postgame) {
            this.state.leaderboard = this.nanoAwarder.apportion(this.state.leaderboard);
            this.nanoAwarder.send(this.state.leaderboard); // async
        } else if (subphase == Subphase.question) {
            this.state.data = this.qReader.nextQuestion(round);
            this.scorekeeper.resetAnswers(this.emitPlayerState);
        } else if (subphase == Subphase.answer) {
            this.state.data = this.qReader.currentQuestionWithAnswers(round);
            this.state.leaderboard = this.scorekeeper.updateScores(
                this.state.round,
                this.state.data,
                this.emitPlayerState
            );
        }
    }

    // Set the number of online connections
    updateOnline() {
        this.state.online = io.engine.clientsCount;
        this.softUpdate = true;
    }

    // Record any answers received during the question subphase
    addAnswer(account, answer) {
        if (this.state.subphase === Subphase.question) {
            this.scorekeeper.addAnswer(account, answer, this.emitPlayerState);
        }
    }
}
