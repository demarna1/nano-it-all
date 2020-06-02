const NanoRPC = require('./nanorpc');

module.exports = class NanoAwarder {

    constructor(cb) {
        // {m, k} constants used for the apportionment equation.
        // Derived from wolfram-alpha using the following expression:
        //     (sum x^(-k) from x = 1 to n) = 5
        // These values assume a Nano pot of 5 Nano. Adjust m
        // proporionally for smaller or larger pot sizes.
        this.MK_TABLE = [
            { m: 0, k: 0 },  // unused
            { m: 0, k: 0 },  // unused
            { m: 0, k: 0 },  // unused
            { m: 0, k: 0 },  // unused
            { m: 2, k: 0.672},   //  4
            { m: 2, k: 0.857},   //  5
            { m: 2, k: 0.971},   //  6
            { m: 1.5, k: 0.697}, //  7
            { m: 1.5, k: 0.768}, //  8
            { m: 1.5, k: 0.823}, //  9
            { m: 1.5, k: 0.866}, // 10
            { m: 1.5, k: 0.901}, // 11
            { m: 1.5, k: 0.931}, // 12
            { m: 1, k: 0.619},   // 13
            { m: 1, k: 0.647},   // 14
            { m: 1, k: 0.672},   // 15
            { m: 1, k: 0.693},   // 16
            { m: 1, k: 0.713},   // 17
            { m: 1, k: 0.730},   // 18
            { m: 1, k: 0.746},   // 19
            { m: 1, k: 0.760},   // 20
            { m: 1, k: 0.773},   // 21
            { m: 1, k: 0.785},   // 22
            { m: 1, k: 0.796},   // 23
            { m: 1, k: 0.806},   // 24
            { m: 1, k: 0.815}    // 25
        ];

        this.kraiPot = 0;
        this.nanoRPC = new NanoRPC();

        this.nanoRPC.getBalance().then((krai) => {
            console.log(`Next game's pot is ${krai/1000} Nano`);
            this.kraiPot = krai;
            cb(this.kraiPot);
        });
    }

    // A winner is anyone who scored in the top half among players
    // who scored more than zero points (maximum of 25 winners)
    numberOfWinners(leaderboard) {
        let qualifiedPlayers = 0;
        for (let i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].score > 0) {
                qualifiedPlayers += 1;
            }
        }
        return Math.min(Math.floor(qualifiedPlayers/2), 25);
    }

    calculateKRai(position, numWinners) {
        let krai = 0;
        if (numWinners === 1) {
            krai = this.kraiPot;
        } else if (numWinners === 2) {
            krai = position === 1 ? (0.7*this.kraiPot) : (0.3*this.kraiPot);
        } else if (numWinners === 3) {
            krai = position === 1 ? (0.5*this.kraiPot) :
                (position === 2 ? (0.3*this.kraiPot) : (0.2*this.kraiPot));
        } else {
            // Apportionment equation: y(x) = mx^(-k)
            let {m, k} = this.MK_TABLE[numWinners];
            m = m * (this.kraiPot/5);
            krai = m * Math.pow(position, (-1 * k));
        }
        return Math.floor(krai);
    }

    // Divvy up the Nano pot based on finish
    apportion(leaderboard) {
        const numWinners = this.numberOfWinners(leaderboard);
        for (let i = 0; i < leaderboard.length; i++) {
            if (i < numWinners) {
                leaderboard[i].krai = this.calculateKRai(i+1, numWinners);
            } else {
                leaderboard[i].krai = 0;
            }
        }
        return leaderboard;
    }

    // Send out the Nano
    async send(leaderboard) {
        for (let i = 0; i < leaderboard.length; i++) {
            const player = leaderboard[i];
            if (player.krai > 0) {
                console.log(`Sending ${player.krai} krai reward to ${player.address}`);
                await this.nanoRPC.sendToAddress(player.krai, player.address);
                console.log('Send complete');
            }
        }
    }
}
