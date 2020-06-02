module.exports = class Player {

    constructor(account) {
        this.id = account.id;
        this.address = account.address;
        this.name = account.name;
        this.sid = account.sid;
        this.score = 0;
        this.krai = 0;
        this.answers = [];
    }
}
