const schedule = require('node-schedule');
const Phase = require('../lib/phase');

module.exports = class Scheduler {

    constructor(cb) {
        const date = new Date(2020, 4, 4, 22, 18, 0);
        cb(Phase.pregame, date);

        const job = schedule.scheduleJob(date, () => {
            const now = new Date();
            cb(Phase.starting, new Date(now.getTime() + 10000));
        });
    }
}
