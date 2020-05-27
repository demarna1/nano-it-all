const Player = require('./player');

module.exports = class Scorekeeper {
    constructor() {
        this.players = {};
    }

    connectPlayer(account) {
        if (this.players.hasOwnProperty(account.id)) {
            this.players[account.id].connected = true;
            this.players[account.id].name = account.name;
        } else {
            this.players[account.id] = new Player(account);
        }
        return this.players[account.id];
    }

    disconnectPlayer(account) {
        this.players[account.id].connected = false;
    }

    resetGame(onChange) {
        const idsToRemove = [];
        for (const id in this.players) {
            let player = this.players[id];
            if (player.connected) {
                if (player.score > 0 || player.rightAnswers.length > 0 ||
                        player.wrongAnswers.length > 0) {
                    player.score = 0;
                    player.rightAnswers = [];
                    player.wrongAnswers = [];
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
            if (player.rightAnswers.length > 0 || player.wrongAnswers.length > 0) {
                player.rightAnswers = [];
                player.wrongAnswers = [];
                onChange(player);
            }
        }
    }

    addAnswer(account, answer, right, timeRemaining) {
        const player = this.players[account.id];

        const answers = right ? player.rightAnswers : player.wrongAnswers;
        if (answers.indexOf(answer) === -1) {
            answers.push(answer);
        }

        if (right) {
            player.score += 20 + (5*timeRemaining);
        }

        return player;
    }

    addSpeedAnswer(account, answer, right, timeRemaining) {
        const player = this.players[account.id];

        if (right) {
            // Check if the answer is already present so don't double-score
            if (player.rightAnswers.indexOf(answer) === -1) {
                player.rightAnswers.push(answer);
                player.score += 40 + (10*timeRemaining);
            }
        } else {
            if (player.wrongAnswers.indexOf(answer) === -1) {
                player.wrongAnswers.push(answer);
            }
        }

        return player;
    }
}
