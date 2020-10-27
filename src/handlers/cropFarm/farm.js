const { cropGetFarm } = require("../../utils/farm/crop/user");
const { formatItems } = require("../../utils/format/itemUtils");

const cropSendFarm = async (msg, user) => {
    var farm = await cropGetFarm(user.id)

    var farmPrices = require("./Shop/Prices/farmPrices"); // Grabs crop prices

    const shopEmbed = { // Creates embed Object
        author: {
            name: `${user.username}'s farm`
        }
    };
    var itemString = ``; // Defines empty string
    for (item in farmPrices.prices) {
        itemString = itemString + `${farmPrices.emojis[item]} ${item} **-** ${formatItems(farm[item])}\n` // Adds a line for every crop
    };

    shopEmbed.fields = [ // Updated embed object with fields
        {
            name: `Crops`,
            value: itemString
        }
    ];

    msg.channel.createMessage({embed: shopEmbed}); // Sends message
    return;
}

module.exports = { cropSendFarm };