
const { handleShopCommand } = require("../handlers/shop");

module.exports = class {
    constructor() {
        this.cmd = 'shop'
        this.aliases = ['market', 'shops']
    }

    async run(client, msg, args) {

        var handle = await handleShopCommand(client, msg, args);
        return handle;

    }
}