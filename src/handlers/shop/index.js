const { cropShopHandler } = require("../cropFarm/Shop");

const handleShopCommand = async (client, msg, args) => {
    if(args[0]) {
        switch(args[0]) {
            case "crops":
            case "crop":
            case "farm":
                cropShopHandler(client, msg, args);
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
                value: `Farming **-** \`${client.config.PREFIX}shop crop\``
            }
        ]
    }
    msg.channel.createMessage({embed: shopEmbed});
}

module.exports = { handleShopCommand };