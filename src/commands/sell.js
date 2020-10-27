const { handleSellCommand } = require("../handlers/shop/sell");

module.exports = class {
    constructor() {
        this.cmd = 'sell'
    }

    async run(client, msg, args) {

        var handle = await handleSellCommand(client, msg, args);
        return handle;

    }
}