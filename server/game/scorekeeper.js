const Player = require('./player');

module.exports = class Scorekeeper {
    constructor() {
        this.players = {};
    }

    connectPlayer(account) {
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
    }

    resetGame(onChange) {
        const idsToRemove = [];
        for (const id in this.players) {
            let player = this.players[id];
            if (player.sid) {
                if (player.score > 0 || player.answers.length > 0) {
                    player.score = 0;
                    player.answers = [];
                    onChange(player);
                }
            } else {
                idsToRemove.push(id);
            }
        }
        for (const id in idsToRemove) {
            delete this.players[id];
        }
    }

    resetAnswers(onChange) {
        for (const id in this.players) {
            let player = this.players[id];
            if (player.answers.length > 0) {
                player.answers = [];
                onChange(player);
            }
        }
    }

    addAnswer(account, answer, onChange) {
        let player = this.players[account.id];
        if (player.answers.indexOf(answer) === -1) {
            player.answers.push(answer);
        }
        onChange(player);
    }
}
