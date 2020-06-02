const NanoClient = require('nano-node-rpc');

module.exports = class NanoRPC {

    constructor() {
        this.active = process.env.NODE_ENV === 'production' &&
            process.env.NINJA_API_KEY && process.env.GAME_PRIV_KEY;
        if (this.active) {
            this.GAME_ADDRESS = 'nano_11y6k3mtobx1kosxyyauq1aejerg3r7xfommtr89n18yzw51fpeqdbtb8ars';
            this.GAME_PRIV_KEY = process.env.GAME_PRIV_KEY;
            this.client = new NanoClient({apiKey: process.env.NINJA_API_KEY});
        }
    }

    getKraiFromRaw(raw) {
        if (raw.length > 27) {
            return parseInt(raw.slice(0, -27));
        } else {
            return 0;
        }
    }

    getRawFromKrai(krai) {
        return `${krai}000000000000000000000000000`;
    }

    // Returns balance (in krai) of the game account
    async getBalance() {
        if (this.active) {
            let response = await this.client.account_balance(this.GAME_ADDRESS);
            return this.getKraiFromRaw(response.balance);
        } else {
            return 0;
        }
    }

    // Sends amount (in krai) from the game account to the given address
    async sendToAddress(krai, address) {
        if (this.active) {
            let accountInfo = await this.client._send('account_info', {
                account: this.GAME_ADDRESS,
                representative: 'true'
            });

            let currentKrai = this.getKraiFromRaw(accountInfo.balance);
            let afterRaw = this.getRawFromKrai(currentKrai - krai);

            let response = await this.client._send('block_create', {
                'json_block': 'true',
                'type': 'state',
                'previous': accountInfo.frontier,
                'account': this.GAME_ADDRESS,
                'representative': accountInfo.representative,
                'balance': afterRaw,
                'link': address,
                'key': this.GAME_PRIV_KEY
            });

            await this.client._send('process', {
                'json_block': 'true',
                'subtype': 'send',
                'block': response.block
            });
            console.log(`New balance after send: ${afterRaw}`);
        }
    }
}
