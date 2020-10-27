const { cropCommandHandler } = require("../handlers/cropFarm")

module.exports = class {
    constructor() {
        this.cmd = 'help'
        this.aliases = ['crop', 'farm']
    }

    async run(client, msg, args) {

        var handle = await cropCommandHandler(client, msg, args);
        return handle;

    }
}