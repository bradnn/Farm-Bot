module.exports = class {
    constructor() {
        this.cmd = 'help'
    }

    async run(client, msg, args) {
        var type = args[0];
        var embed;

        switch(type) {
            case "farm":
                break;
            default:
                embed = {
                    author: {
                        name: `Main Help Menu`,
                        icon_url: client.user.avatarURL
                    },
                    fields: [
                        {
                            name: `Shop`,
                            value: `**Commands:**
${client.config.PREFIX}shop **-** Shows the shop menu
${client.config.PREFIX}buy (item) <amount> **-** Buys an item from the store
${client.config.PREFIX}sell (item) <amount/all> **-** Sells an item to the store at 50% of original price`
                        },
                        {
                            name: `Farming`,
                            value: `**Commands:**
${client.config.PREFIX}farm (user) **-** Shows your farm or the mentioned users farm
${client.config.PREFIX}farm plant **-** Plants you have in your inventory
${client.config.PREFIX}farm harvest **-** Harvests planted crops
${client.config.PREFIX}farm fertilize **-** Uses a tractor to lower harvest cooldown
${client.config.PREFIX}farm protect **-** Uses a scarecrow to end the chance of losing crops from harvest
${client.config.PREFIX}farm land **-** Shows how much land you own and your crop caps
${client.config.PREFIX}farm land buy **-** Buys more land`
                        },
                        {
                            name: `User`,
                            value: `**Commands:**
${client.config.PREFIX}inventory (user) **-** Shows your inventory or the mentioned users inventory
${client.config.PREFIX}pay (user) (amount) **-** Pays a user from your balance`
                        },
                        {
                            name: `Town Hall`,
                            value: `**Commands:**
${client.config.PREFIX}contribute **-** Contributes money to the town hall for a +1% harvest boost
${client.config.PREFIX}contribute info **-** Shows global contributations`
                        }
                    ]
                }
                break;
        }
        msg.channel.createMessage({embed: embed});
        return;
    }
}