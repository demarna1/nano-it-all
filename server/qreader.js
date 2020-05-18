const models = require('./models');

module.exports = class QReader {

    // Initialize the next array. By doing the database queries now,
    // we can return the next question immediately when requested.
    constructor() {
        this.current = null;
        this.next = [null, null, null];
        for (let round = 1; round < 4; round++) {
            this.readNext(round);
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
                this.next[round-1] = question;
            } else {
                // All questions for this round have been asked, so reset the
                // flag so we can ask them again. Then try the read again.
                console.log(`WARN: Duplicate questions for round ${round}`);
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
        const question = this.next[round-1];
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
