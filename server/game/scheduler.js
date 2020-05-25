const schedule = require('node-schedule');
const {Phase, Subphase} = require('../../lib/phase');

module.exports = class Scheduler {

    constructor(cb) {
        this.cb = cb;
        this.phase = Phase.pregame;
        this.subphase = Subphase.round;
        this.question = 0;

        //const date = new Date(2020, 4, 25, 1, 20, 0);
        //this.cb(this.phase, this.subphase, date, this.question);
        //schedule.scheduleJob(date, this.startGame);

        this.startGame();
    }

    runPhase(next, delayMs) {
        this.cb(this.phase, this.subphase, this.getEndDate(delayMs), this.question);
        setTimeout(next, delayMs);
    }

    getEndDate(delayMs) {
        const now = new Date();
        return new Date(now.getTime() + delayMs);
    }

    isGameOver() {
        return this.question % 15 === 0;
    }

    isNextRound() {
        return this.question === 5 || this.question === 12;
    }

    // Display the game transition screen
    startGame = () => {
        this.phase = Phase.starting;
        this.subphase = Phase.round;
        this.question = 0;
        this.runPhase(this.startRound, 8000);
    }

    // Display the round transition screen
    startRound = () => {
        switch (this.phase) {
            case Phase.starting:
                this.phase = Phase.warmup;
                break;
            case Phase.warmup:
                this.phase = Phase.speed;
                break;
            case Phase.speed:
            default:
                this.phase = Phase.ranking;
                break;
        }

        this.subphase = Subphase.round;
        this.runPhase(this.startPreQuestion, 6000);
    }

    // Display the question transition screen
    startPreQuestion = () => {
        this.subphase = Subphase.prequestion;
        this.question++;
        this.runPhase(this.startQuestion, 1500);
    }

    // Display the question
    startQuestion = () => {
        let delayMs;
        switch (this.phase) {
            case Phase.speed:
                delayMs = 6000;
                break;
            case Phase.warmup:
            case Phase.ranking:
            default:
                delayMs = 12000;
                break;
        }

        this.subphase = Subphase.question;
        this.runPhase(this.startPostQuestion, delayMs);
    }

    // Wait to display the right answer
    startPostQuestion = () => {
        this.subphase = Subphase.postquestion;
        this.runPhase(this.startAnswer, 1500);
    }

    // Display the right answer
    startAnswer = () => {
        let next;
        if (this.isGameOver()) {
            next = this.startGameOver;
        } else if (this.isNextRound()) {
            next = this.startRound;
        } else {
            next = this.startPreQuestion;
        }

        this.subphase = Subphase.answer;
        this.runPhase(next, 5000);
    }

    // Display the game over page
    startGameOver = () => {
        this.phase = Phase.postgame;
        this.subphase = Phase.round;
        this.runPhase(this.startGame, 10000);
    }
}
