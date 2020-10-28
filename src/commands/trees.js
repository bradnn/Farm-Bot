const { cropCommandHandler } = require("../handlers/cropFarm");
const { treeCommandHandler } = require("../handlers/treeFarm");

module.exports = class {
    constructor() {
        this.cmd = 'trees'
        this.aliases = ['tree', 'treefarm']
    }

    async run(client, msg, args) {

        var handle = await treeCommandHandler(client, msg, args);
        return handle;

    }
}