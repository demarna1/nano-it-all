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
        let leaderboard = [];
        const idsToRemove = [];

        for (const id in this.players) {
            let player = this.players[id];
            if (player.sid) {
                if (player.score > 0 || player.answers.length > 0) {
                    player.score = 0;
                    player.answers = [];
                    onChange(player);
                }

                leaderboard.push({
                    id: player.id,
                    name: player.name,
                    address: player.address,
                    score: player.score
                });
            } else {
                idsToRemove.push(id);
            }
        }

        for (const id in idsToRemove) {
            delete this.players[id];
        }

        // Sort and return the leaderboard
        leaderboard.sort((a, b) => {
            return b.score - a.score;
        });
        return leaderboard;
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

    updateScores(round, questionData, onChange) {
        const isRight = {};
        for (let i = 0; i < questionData.choices.length; i++) {
            isRight[questionData.choices[i]] = questionData.isRight[i];
        }

        let leaderboard = [];
        for (const id in this.players) {
            let changed = false;
            let player = this.players[id];

            for (let i = 0; i < player.answers.length; i++) {
                if (isRight[player.answers[i]]) {
                    if (round === 1) {
                        player.score += 75;
                    } else if (round === 2) {
                        player.score += 150;
                    } else {
                        player.score += 120;
                    }
                    changed = true;
                }
            }

            if (changed) {
                onChange(player);
            }

            leaderboard.push({
                id: player.id,
                name: player.name,
                address: player.address,
                score: player.score
            });
        }

        // Sort and return the leaderboard
        leaderboard.sort((a, b) => {
            return b.score - a.score;
        });
        return leaderboard;
    }
}
