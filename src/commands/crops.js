const { CropHandlers } = require("../handlers/crops/handlers");

module.exports = class {
    constructor() {
        this.cmd = 'crops'
        this.aliases = ['crop', 'farm']
    }

    async run(client, msg, args) {

        var handle = await CropHandlers.handler(client, msg, args);
        return handle;

    }
}