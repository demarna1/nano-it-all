const Scheduler = require('./scheduler');
const State = require('./state');
const Phase = require('../lib/phase');
const { Op } = require("sequelize");
const models = require('./models');
const io = require('./index').io;

module.exports = class Game {

    constructor() {
        this.state = new State();
        this.softUpdate = false;

        // Start the scheduler responsible for phase changes
        this.scheduler = new Scheduler((phase, phaseEndDate) => {
            this.updatePhase(phase, phaseEndDate).then(() => {
                this.broadcastState();
            });
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

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    async getQuestionData(round) {
        const question = await models.Question.findOne({
            where: {
                [Op.and]: [{ round }, { asked: false }]
            }
        });

        // TODO: if question is null, reset all 'asked' to false

        const rightanswers = question.rightanswers.split(',');
        const wronganswers = question.wronganswers.split(',');
        const choices = [...rightanswers, ...wronganswers];
        this.shuffleArray(choices);

        question.asked = true;
        question.save();

        return { question: question.question, choices };
    }

    async updatePhase(phase, phaseEndDate) {
        this.state.phase = phase;
        this.state.phaseEndDate = phaseEndDate;

        if (phase === Phase.round) {
            this.state.round++;
        } else if (phase == Phase.question) {
            this.state.question++;
            this.state.data = await this.getQuestionData(this.state.round);
        }
    }

    // Set the number of online connections
    updateOnline() {
        this.state.online = io.engine.clientsCount;
        this.softUpdate = true;
    }
}
