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

        this.nanopot = 5;
        cb(this.nanopot);
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

    calculateKNano(position, numWinners) {
        let nano = 0.0;
        if (numWinners === 1) {
            nano = 5.0;
        } else if (numWinners === 2) {
            nano = position === 1 ? 3.5 : 1.5;
        } else if (numWinners === 3) {
            nano = position === 1 ? 2.5 : (position === 2 ? 1.5 : 1.0);
        } else {
            // Apportionment equation: y(x) = mx^(-k)
            let {m, k} = this.MK_TABLE[numWinners];
            m = m * (this.nanopot/5);
            nano = m * Math.pow(position, (-1 * k));
        }
        return Math.floor(nano*1000);
    }

    // Divvy up the Nano pot based on finish
    apportion(leaderboard) {
        const numWinners = this.numberOfWinners(leaderboard);
        for (let i = 0; i < leaderboard.length; i++) {
            if (i < numWinners) {
                leaderboard[i].knano = this.calculateKNano(i+1, numWinners);
            } else {
                leaderboard[i].knano = 0;
            }
        }
        return leaderboard;
    }

    // Send out the Nano
    send(leaderboard) {

    }
}
