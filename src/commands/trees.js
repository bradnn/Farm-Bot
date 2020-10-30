const { TreeHandlers } = require("../handlers/trees/handlers");

module.exports = class {
    constructor() {
        this.cmd = 'trees'
        this.aliases = ['tree', 'treefarm']
    }

    async run(client, msg, args) {

        var handle = await TreeHandlers.handler(client, msg, args);
        return handle;

    }
}