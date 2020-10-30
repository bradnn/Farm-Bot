const { handleInventoryCommand } = require("../handlers/profile");

module.exports = class {
    constructor() {
        this.cmd = 'inventory'
    }

    async run(client, msg, args) {

        var handle = await handleInventoryCommand(client, msg, args);
        return handle;

    }
}