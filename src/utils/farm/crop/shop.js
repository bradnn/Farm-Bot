const { delMoney, addMoney } = require("../../user/money");
const { formatMoney } = require("../../format/moneyUtils");
const { getProfile } = require("../../user/user");
const { addItem, delItem, getItem } = require("../items/items");

const handleFarmBuy = async (user, item, amount, msg) => {
    var profile = await getProfile(user.id);

    var cropPrices = require("../../../handlers/cropFarm/Shop/Prices/farmPrices");
    var toolPrices = require("../../../handlers/cropFarm/Shop/Prices/toolPrices");

    var itemPrices = { ...cropPrices.prices, ...toolPrices.prices};

    var price = itemPrices[item] * amount;

    if(profile.econ.balance >= price) {
        if(amount >= 100 || price >= 1000000) {
            msg.channel.createMessage(`Are you sure you want to buy ${amount}x ${item} for ${formatMoney(price)}?
Type \`yes\` to confirm the purchase.`);

            let responses = await msg.channel.awaitMessages(m => m.author.id == msg.author.id && m.content == "yes", { time: 30000, maxMatches: 1});
            if(!responses.length) {
                return;
            }
        }
        

        delMoney(user.id, price);
        addItem(user.id, item, amount);

        msg.channel.createMessage(`You have just purchased ${amount}x ${item} for ${formatMoney(price)}`);
        
    } else {
        msg.channel.createMessage(`You don't have ${formatMoney(price)} to buy ${amount}x ${item}`)
        return;
    }
}

const handleFarmSell = async (user, item, amount, msg) => {
    var cropPrices = require("../../../handlers/cropFarm/Shop/Prices/farmPrices");
    var toolPrices = require("../../../handlers/cropFarm/Shop/Prices/toolPrices");

    var itemPrices = { ...cropPrices.prices, ...toolPrices.prices};

    var price = (itemPrices[item] * amount) * 0.5;
    var theirItem = await getItem(user.id, item);

    if(theirItem >= amount) {
        if(amount >= 100) {
            msg.channel.createMessage(`Are you sure you want to sell ${amount}x ${item} for ${formatMoney(price)}?
Type \`yes\` to confirm the purchase.`);

            let responses = await msg.channel.awaitMessages(m => m.author.id == msg.author.id && m.content == "yes", { time: 30000, maxMatches: 1});
            if(!responses.length) {
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

module.exports = { handleFarmBuy, handleFarmSell };11