const schedule = require('node-schedule');
const Phase = require('../lib/phase');

module.exports = class Scheduler {

    constructor(cb) {
        this.cb = cb;
        this.round = 0;
        this.question = 0;

        //const date = new Date(2020, 4, 24, 20, 0, 0);
        //this.cb(Phase.pregame, date);
        //schedule.scheduleJob(date, this.startGame);

        this.startGame();
    }

    runPhase(phase, next, delayMs) {
        this.cb(phase, this.getEndDate(delayMs), this.round, this.question);
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
        return this.question % 5 === 0;
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
        this.runPhase(Phase.round, this.startPreQuestion, 6000);
    }

    // Display the question transition screen
    startPreQuestion = () => {
        this.question++;
        this.runPhase(Phase.prequestion, this.startQuestion, 1500);
    }

    // Display the question
    startQuestion = () => {
        let delayMs;
        if (this.round === 1) {
            delayMs = 12000;
        } else if (this.round === 2) {
            delayMs = 6000;
        } else {
            delayMs = 12000;
        }

        this.runPhase(Phase.question, this.startPostQuestion, delayMs);
    }

    // Wait to display the right answer
    startPostQuestion = () => {
        this.runPhase(Phase.postquestion, this.startAnswer, 2000);
    }

    // Display the right answer
    startAnswer = () => {
        let next;
        if (this.isGameOver()) {
            next = this.startGameOver();
        } else if (this.isNextRound()) {
            next = this.startRound;
        } else {
            next = this.startPreQuestion;
        }

        this.runPhase(Phase.answer, next, 5000);
    }

    // Display the game over page
    startGameOver = () => {
        this.runPhase(Phase.postgame, this.startGame, 10000);
    }
}
