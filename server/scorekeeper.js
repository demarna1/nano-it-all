const Player = require('./player');

module.exports = class Scorekeeper {
    constructor() {
        this.players = {};
    }

    addPlayer(account) {
        if (this.players.hasOwnProperty(account.id)) {
            this.players[account.id].sid = account.sid;
            this.players[account.id].name = account.name;
        } else {
            this.players[account.id] = new Player(account);
        }
        return this.players[account.id];
    }

    disconnectPlayer(account) {
        this.players[account.id].sid = null;
        return this.players[account.id];
    }

    removePlayer(account) {
        delete this.players[account.id];
    }

    resetAnswers(onChange) {
        for (const id in this.players) {
            let player = this.players[id];
            player.rightAnswers = [];
            player.wrongAnswers = [];
            onChange(player);
        }
    }

    addAnswer(account, answer, right) {
        const player = this.players[account.id];
        const answers = right ? player.rightAnswers : player.wrongAnswers;
        if (answers.indexOf(answer) === -1) {
            answers.push(answer);
        }
        return player;
    }
}
