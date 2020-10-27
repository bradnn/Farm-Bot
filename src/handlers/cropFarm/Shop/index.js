const { formatMoney } = require("../../../utils/format/moneyUtils");

const cropShopHandler = async (client, msg, args) => {
    var farmPrices = require("./Prices/farmPrices"); // Grabs crop prices
    var toolPrices = require("./Prices/toolPrices"); // Grabs item prices

    const shopEmbed = { // Creates embed Object
        author: {
            name: `Farming Shop`
        }
    };
    var itemString = ``; // Defines empty string
    var toolString = ``; // Defines empty string
    for (item in farmPrices.prices) {
        itemString = itemString + `${farmPrices.emojis[item]} ${item} **-** ${formatMoney(farmPrices.prices[item])}\n` // Adds a line for every crop
    };
    for (item in toolPrices.prices) {
        toolString = toolString + `${toolPrices.emojis[item]} ${item} **-** ${formatMoney(toolPrices.prices[item])}\n` // Adds a line for every item
    };

    shopEmbed.fields = [ // Updated embed object with fields
        {
            name: `Tools`,
            value: toolString
        },
        {
            name: `Crops`,
            value: itemString
        }
    ];

    msg.channel.createMessage({embed: shopEmbed}); // Sends message
    return;
}

module.exports = { cropShopHandler };