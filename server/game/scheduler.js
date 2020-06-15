const schedule = require('node-schedule');
const {Phase, Subphase} = require('../../lib/phase');

module.exports = class Scheduler {

    constructor(cb) {
        this.cb = cb;
        this.round = 0;
        this.question = 0;

        const date = new Date(2020, 5, 21, 20, 0, 0);
        this.cb(Phase.pregame, Phase.round, date, this.round, this.question);
        schedule.scheduleJob(date, this.startGame);
    }

    getEndDate(delayMs) {
        const now = new Date();
        return new Date(now.getTime() + delayMs);
    }

    run(phase, subphase, next, delayMs) {
        const endDate = this.getEndDate(delayMs);
        this.cb(phase, subphase, endDate, this.round, this.question);
        setTimeout(next, delayMs);
    }

    runPhase(phase, next, delayMs) {
        this.run(phase, Subphase.round, next, delayMs);
    }

    runSubphase(subphase, next, delayMs) {
        this.run(Phase.running, subphase, next, delayMs);
    }

    // Display the game transition screen
    startGame = () => {
        this.round = 0;
        this.question = 0;
        this.runPhase(Phase.starting, this.startRound, 8000);
    }

    // Display the round transition screen
    startRound = () => {
        this.round++;
        this.runPhase(Phase.running, this.startPreQuestion, 6000);
    }

    // Display the question transition screen
    startPreQuestion = () => {
        this.question++;
        this.runSubphase(Subphase.prequestion, this.startQuestion, 1500);
    }

    // Display the question
    startQuestion = () => {
        let delayMs;
        switch (this.round) {
            case 1:
                delayMs = 12000;
                break;
            case 2:
                delayMs = 7000;
                break;
            case 3:
            default:
                delayMs = 16000;
                break;
        }

        this.runSubphase(Subphase.question, this.startPostQuestion, delayMs);
    }

    // Wait to display the right answer
    startPostQuestion = () => {
        this.runSubphase(Subphase.postquestion, this.startAnswer, 1500);
    }

    // Display the right answer
    startAnswer = () => {
        let next;
        if (this.question % 15 === 0) {
            next = this.startGameOver;
        } else if (this.question === 5 || this.question === 12) {
            next = this.startRound;
        } else {
            next = this.startPreQuestion;
        }

        this.runSubphase(Subphase.answer, next, 6000);
    }

    // Display the game over page
    startGameOver = () => {
        const endDate = this.getEndDate(10000);
        this.cb(Phase.postgame, Subphase.round, endDate, this.round, this.question);
    }
}
