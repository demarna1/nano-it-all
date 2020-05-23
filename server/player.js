module.exports = class Player {

    constructor(account) {
        this.address = account.address;
        this.name = account.name;
        this.sid = account.sid;
        this.score = 0;
        this.rightAnswers = [];
        this.wrongAnswers = [];
    }
}
