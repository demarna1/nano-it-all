module.exports = class Player {

    constructor(account) {
        this.address = account.address;
        this.name = account.name;
        this.connected = true;
        this.score = 0;
        this.rightAnswers = [];
        this.wrongAnswers = [];
    }
}
