const schedule = require('node-schedule');
const Phase = require('../lib/phase');

module.exports = class Scheduler {

    constructor(cb) {
        const date = new Date(2020, 4, 3, 18, 13, 0);
        const now = new Date();
        cb(Phase.pregame, date.getTime() - now.getTime());

        const job = schedule.scheduleJob(date, () => {
            cb(Phase.starting, 10000);
        });
    }
}
