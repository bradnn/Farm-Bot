const { handleBuyCommand } = require("../handlers/shop/buy");

module.exports = class {
    constructor() {
        this.cmd = 'buy'
    }

    async run(client, msg, args) {

        var handle = await handleBuyCommand(client, msg, args);
        return handle;

    }
}