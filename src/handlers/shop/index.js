const { CropShop } = require("../crops/Shop");
const { TreeShop } = require('../trees/Shop/index');

const handleShopCommand = async (client, msg, args) => {
    if(args[0]) {
        switch(args[0]) {
            case "crops":
            case "crop":
                CropShop.handleShop(client, msg, args);
                return;
            case "trees":
            case "tree":
                TreeShop.handleShop(client, msg, args);
                return;
        }
    }
    const shopEmbed = {
        author: {
            name: `Shop Portal`,
            icon_url: msg.author.avatarURL
        },
        description: `Usage: \`${client.config.PREFIX}shop <market>\``,
        fields: [
            {
                name: `Markets`,
                value: `Crop Farming **-** \`${client.config.PREFIX}shop crop\`
Tree Farming **-** \`${client.config.PREFIX}shop tree`
            }
        ]
    }
    msg.channel.createMessage({embed: shopEmbed});
}

module.exports = { handleShopCommand };