const { Tree } = require("../handlers/trees/utils");

module.exports = class {
    constructor() {
        this.cmd = 'atest'
    }

    async run(client, msg, args) {

        var obj = {
            pine: 10
        }

        var handle = await Tree.addInventory(msg.author.id, obj);
        return handle;

    }
}