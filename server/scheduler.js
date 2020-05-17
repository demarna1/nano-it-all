const schedule = require('node-schedule');
const Phase = require('../lib/phase');

module.exports = class Scheduler {

    constructor(cb) {
        this.cb = cb;
        //const date = new Date(2020, 4, 16, 18, 55, 0);
        //this.cb(Phase.pregame, date);
        //schedule.scheduleJob(date, this.startGame);

        this.startGame();
    }

    // 6-second start game transition
    startGame = () => {
        const now = new Date();
        this.cb(Phase.starting, new Date(now.getTime() + 6000));
        setTimeout(this.startRound, 8000);
    }

    // 5-second round transition
    startRound = () => {
        const now = new Date();
        this.cb(Phase.round, new Date(now.getTime() + 5000));
        setTimeout(this.startQuestion, 6000);
    }

    // 8 seconds to answer question
    startQuestion = () => {
        const now = new Date();
        this.cb(Phase.question, new Date(now.getTime() + 8000));
        setTimeout(this.startWaitAnswer, 8000);
    }

    // 2 seconds until we show the right answer
    startWaitAnswer = () => {
        const now = new Date();
        this.cb(Phase.waitAnswer, new Date(now.getTime() + 2000));
        setTimeout(this.startShowAnswer, 2000);
    }

    // 4 seconds until we show the next question
    startShowAnswer = () => {
        const now = new Date();
        this.cb(Phase.showAnswer, new Date(now.getTime() + 4000));
        setTimeout(this.startQuestion, 4000);
    }
}
