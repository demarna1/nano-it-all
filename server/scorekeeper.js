const Player = require('./player');

module.exports = class Scorekeeper {
    constructor() {
        this.round = 0;
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

    resetAnswers(round, onChange) {
        this.round = round;
        for (const id in this.players) {
            let player = this.players[id];
            player.rightAnswers = [];
            player.wrongAnswers = [];
            onChange(player);
        }
    }

    addAnswer(account, answer, right, timeRemaining) {
        const player = this.players[account.id];

        const answers = right ? player.rightAnswers : player.wrongAnswers;
        if (answers.indexOf(answer) === -1) {
            answers.push(answer);
        }

        if (right) {
            if (this.round === 1) {
                player.score += 20 + (5*timeRemaining);
            } else if (this.round === 2) {
                player.score += 40 + (10*timeRemaining);
            } else {
                player.score += 0;
            }
        }

        return player;
    }
}
