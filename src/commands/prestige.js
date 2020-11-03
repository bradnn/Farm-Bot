
const { PresHandlers } = require("../handlers/prestiges/handlers");

module.exports = class {
    constructor() {
        this.cmd = 'prestige',
        this.aliases = ['pres']
    }

    async run(client, msg, args) {

        var handle = await PresHandlers.handler(client, msg, args);
        return handle;

    }
}