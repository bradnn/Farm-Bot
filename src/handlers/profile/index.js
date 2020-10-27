const { cropGetCrops } = require("../../utils/farm/crop/user");
const { formatItems } = require("../../utils/format/itemUtils");
const { formatMoney } = require("../../utils/format/moneyUtils");
const { getProfile } = require("../../utils/user/user");

const handleInventoryCommand = async (client, msg, args) => {
    let user = msg.mentions[0] || client.users.get(args[0]);
    if (!user) user = msg.author;

    var crops = await cropGetCrops(user.id);
    var profile = await getProfile(user.id);

    if(args[0]) {
        switch(args[0]) {
            case "crops":
            case "farm":
                var farmPrices = require("../../handlers/cropFarm/Shop/Prices/farmPrices");
                var toolPrice = require("../../handlers/cropFarm/Shop/Prices/toolPrices");

                var cropList = ``
                var itemList = ``

                for(crop in farmPrices.prices) {
                    cropList = cropList + `${farmPrices.emojis[crop]} ${crop} **-** ${profile.inventory.crops[crop]}\n`
                }

                for(item in toolPrice.prices) {
                    itemList = itemList + `${toolPrice.emojis[item]} ${item} **-** ${profile.inventory.items[item]}\n`
                }

                const inventoryEmbed = {
                    author: {
                        name: `${user.username}'s inventory`,
                        icon_url: user.avatarURL
                    },
                    fields: [
                        {
                            name: `Crops`,
                            value: `${cropList}`
                        },
                        {
                            name: `Items`,
                            value: `${itemList}`
                        }
                    ]
                }
            
                msg.channel.createMessage({embed: inventoryEmbed});
                return;
        }
        return;
    }

    const inventoryEmbed = {
        author: {
            name: `${user.username}'s inventory`,
            icon_url: user.avatarURL
        },
        fields: [
            {
                name: `Banking`,
                value: `💷 Balance **-** ${formatMoney(profile.econ.balance)}`
            }, 
            {
                name: `Boosters`,
                value: `🥇 Prestige **-** ${formatItems(profile.boosts.prestige.farmLevel)}`
            }, 
            {
                name: `Farming Categories`,
                value: `Crops **-** \`${client.config.PREFIX}inventory crops\``
            }
        ]
    }

    msg.channel.createMessage({embed: inventoryEmbed});

}

module.exports = { handleInventoryCommand };