const { AuctionHandlers } = require("../handlers/auctions/handlers");

module.exports = class {
    constructor() {
        this.cmd = 'auction',
        this.aliases = ['ah', 'auctions', 'auchouse']
    }

    async run(client, msg, args) {
        var handle = AuctionHandlers.handle(client, msg, args);
        return handle;

    }
}