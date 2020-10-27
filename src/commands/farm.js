const { cropCommandHandler } = require("../handlers/cropFarm")

module.exports = class {
    constructor() {
        this.cmd = 'help'
    }

    async run(client, msg, args) {

        var handle = await cropCommandHandler(client, msg, args);
        return handle;

    }
}