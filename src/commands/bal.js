const { cropCommandHandler } = require("../handlers/cropFarm");
const { handleInventoryCommand } = require("../handlers/profile");
const { handleShopCommand } = require("../handlers/shop");

module.exports = class {
    constructor() {
        this.cmd = 'inventory'
    }

    async run(client, msg, args) {

        var handle = await handleInventoryCommand(client, msg, args);
        return handle;

    }
}