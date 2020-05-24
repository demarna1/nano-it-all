const {Phase} = require('../../lib/phase');
const models = require('../models');

module.exports = class QReader {

    // Initialize the next questions. By doing the database queries now,
    // we can return the next question immediately when requested.
    constructor() {
        this.current = null;
        this.nextWarmup = null;
        this.nextSpeed = null;
        this.nextRanking = null;
        this.readNext(Phase.warmup);
        this.readNext(Phase.speed);
        this.readNext(Phase.ranking);
    }

    setNext(round, question) {
        switch (round) {
            case Phase.warmup:
                this.nextWarmup = question;
                break;
            case Phase.speed:
                this.nextSpeed = question;
                break;
            case Phase.ranking:
            default:
                this.nextRanking = question;
                break;
        }
    }

    getNext(round) {
        switch (round) {
            case Phase.warmup:
                return this.nextWarmup;
            case Phase.speed:
                return this.nextSpeed;
            case Phase.ranking:
            default:
                return this.nextRanking;
        }
    }

    // Asynchronously pre-load the next question.
    readNext(round) {
        models.Question.findOne({
            where: {
                round,
                asked: false
            }
        }).then((question) => {
            if (question) {
                this.setNext(round, question);
            } else {
                // All questions for this round have been asked, so reset the
                // flag so we can ask them again. Then try the read again.
                console.log(`WARN: Duplicate questions for ${round} round`);
                models.Question.update({ asked: false }, {
                    where: { round }
                }).then(() => {
                    this.readNext(round);
                });
            }
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    nextQuestion(round) {
        const question = this.getNext(round);
        question.asked = true;
        question.save().then(() => {
            this.readNext(round);
        });

        let rightanswers = question.rightanswers.split(',');
        let wronganswers = question.wronganswers.split(',');
        if (wronganswers[0] === '') {
            wronganswers = [];
        }

        this.current = { rightanswers, wronganswers };

        const choices = [...rightanswers, ...wronganswers];
        this.shuffleArray(choices);

        return { question: question.question, choices };
    }

    isRightAnswer(answer) {
        return this.current && this.current.rightanswers.indexOf(answer) > -1;
    }
}
