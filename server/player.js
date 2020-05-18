module.exports = class Player {

    constructor(account) {
        this.name = account.name;
        this.sid = account.sid;
        this.score = 0;
    }
}
