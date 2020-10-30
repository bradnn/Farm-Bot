const { addItem, delItem, getItem } = require("../../../utils/farm/items/items");
const { formatMoney } = require("../../../utils/format/moneyUtils");
const { delMoney, addMoney } = require("../../../utils/user/money");
const { getProfile } = require("../../../utils/user/user");

var farmPrices = require("./Prices/farmPrices"); // Grabs crop prices
var toolPrices = require("./Prices/toolPrices"); // Grabs item prices
var itemPrices = {...farmPrices.prices, ...toolPrices.prices}; // Combines prices

module.exports.TreeShop = {
    handleShop: function (client, msg, args) {
        const shopEmbed = { // Creates embed Object
            author: {
                name: `Tree Shop`
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
                name: `Trees`,
                value: itemString
            }
        ];
    
        msg.channel.createMessage({embed: shopEmbed}); // Sends message
        return;
    },
    handleBuy: async function (user, item, amount, msg) {
        var profile = await getProfile(user.id);
        var price = itemPrices[item] * amount;

        
        if (profile.econ.balance >= price) {
            if (amount >= 100 || price >= 1000000) {
                msg.channel.createMessage(`Are you sure you want to buy ${amount}x ${item} for ${formatMoney(price)}?
    Type \`yes\` to confirm the purchase.`);
    
                let responses = await msg.channel.awaitMessages(m => m.author.id == msg.author.id && m.content == "yes", { time: 30000, maxMatches: 1});
                if (!responses.length) {
                    return;
                }
            }

            delMoney(user.id, price);
            addItem(user.id, item, amount);
            msg.channel.createMessage(`You have just purchased ${amount}x ${item} for ${formatMoney(price)}`);
            return;
        } else {
            msg.channel.createMessage(`You don't have ${formatMoney(price)} to buy ${amount}x ${item}`)
            return;
        }
    },
    handleSell: async function (user, item, amount, msg) {
        var price = (itemPrices[item] * amount) * 0.5; // Gets item sell price by halving the buy price.
        var theirItem = await getItem(user.id, item);

        if (theirItem >= amount) {
            if (amount >= 100) {
                msg.channel.createMessage(`Are you sure you want to sell ${amount}x ${item} for ${formatMoney(price)}?
    Type \`yes\` to confirm the purchase.`);
    
                let responses = await msg.channel.awaitMessages(m => m.author.id == msg.author.id && m.content == "yes", { time: 30000, maxMatches: 1});
                if (!responses.length) {
                    return;
                }
            }

            addMoney(user.id, price);
            delItem(user.id, item, amount);
            msg.channel.createMessage(`You have just sold ${amount}x ${item} for ${formatMoney(price)}`);    
        } else {
            msg.channel.createMessage(`You don't have ${amount} ${item} to sell!`)
            return;
        }
    }
};