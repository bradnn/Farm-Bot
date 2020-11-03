const { AuctionUtils } = require("../handlers/auctions/utils");

module.exports = class {
    async run(client) {
        console.log(`${client.user.username} is ready now!`);

        let name = {
            name: `farms`,
            type: 1,
            url: `https://twitch.tv/imsycles`
        };
        client.editStatus("online", name);

        setInterval(function() {
            AuctionUtils.rarityAuction("get");
            console.log("Updating auctions...");
        }, 60 * 1000);
    }
}