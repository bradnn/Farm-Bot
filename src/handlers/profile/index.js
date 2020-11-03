const { formatItems } = require("../../utils/format/itemUtils");
const { formatMoney } = require("../../utils/format/moneyUtils");
const { getProfile } = require("../../utils/user/user");
const { CropUtils } = require('../crops/utils');
const { TreeUtils } = require('../trees/utils');

const handleInventoryCommand = async (client, msg, args) => {
    let user = msg.mentions[0] || client.users.get(args[0]);
    if (!user) user = msg.author;

    var profile = await getProfile(user.id);

    if(args[0]) {
        switch(args[0]) {
            case "crops":
            case "farm":
                var farmPrices = CropUtils.getPrices("crops");
                var toolPrice = CropUtils.getPrices("items");

                var cropList = ``
                var itemList = ``

                for(crop in farmPrices.prices) {
                    cropList = cropList + `${farmPrices.emojis[crop]} ${crop} **-** ${profile.inventory.farms.crops[crop]}\n`
                }

                for(item in toolPrice.prices) {
                    itemList = itemList + `${toolPrice.emojis[item]} ${item} **-** ${profile.inventory.items.farmTools.crops[item]}\n`
                }

                const cropEmbed = {
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
            
                msg.channel.createMessage({embed: cropEmbed});
                return;
            case "trees":
            case "tree":
                var farmPrices = TreeUtils.getPrices("crops");
                var toolPrice = TreeUtils.getPrices("items");

                var cropList = ``
                var itemList = ``

                for(crop in farmPrices.prices) {
                    cropList = cropList + `${farmPrices.emojis[crop]} ${crop} **-** ${profile.inventory.farms.trees[crop]}\n`
                }

                for(item in toolPrice.prices) {
                    itemList = itemList + `${toolPrice.emojis[item]} ${item} **-** ${profile.inventory.items.farmTools.trees[item]}\n`
                }

                const treeEmbed = {
                    author: {
                        name: `${user.username}'s inventory`,
                        icon_url: user.avatarURL
                    },
                    fields: [
                        {
                            name: `Trees`,
                            value: `${cropList}`
                        },
                        {
                            name: `Items`,
                            value: `${itemList}`
                        }
                    ]
                }
            
                msg.channel.createMessage({embed: treeEmbed});
                return;
        }
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
                value: `Crops **-** \`${client.config.PREFIX}inventory crops\`
Trees **-** \`${client.config.PREFIX}inventory trees\``
            }
        ]
    }

    msg.channel.createMessage({embed: inventoryEmbed});

}

module.exports = { handleInventoryCommand };