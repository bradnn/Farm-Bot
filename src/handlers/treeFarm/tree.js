const { treeGetFarm } = require("../../utils/farm/tree/user");
const { formatItems } = require("../../utils/format/itemUtils");

const treeSendFarm = async (msg, user) => {
    var farm = await treeGetFarm(user.id)

    var farmPrices = require("./Shop/Prices/farmPrices"); // Grabs crop prices

    const treeEmbed = { // Creates embed Object
        author: {
            name: `${user.username}'s farm`
        }
    };
    var itemString = ``; // Defines empty string
    for (item in farmPrices.prices) {
        itemString = itemString + `${farmPrices.emojis[item]} ${item} **-** ${formatItems(farm[item])}\n` // Adds a line for every crop
    };

    treeEmbed.fields = [ // Updated embed object with fields
        {
            name: `Trees`,
            value: itemString
        }
    ];

    msg.channel.createMessage({embed: treeEmbed}); // Sends message
    return;
}

module.exports = { treeSendFarm };