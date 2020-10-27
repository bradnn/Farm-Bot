const { handleFarmSell } = require("../../utils/farm/crop/shop");

const handleSellCommand = async (client, msg, args) => {
    let item = args[0];
    let amount = parseInt(args[1]);

    if(!amount || amount == null || amount == undefined || amount < 0) {
        amount = 1
    }
    var farmCrops = require("../cropFarm/Shop/Prices/farmPrices");
    var farmTools = require("../cropFarm/Shop/Prices/toolPrices");

    farmCrops = Object.keys(farmCrops.prices);
    farmTools = Object.keys(farmTools.prices);

    if(farmCrops.includes(item) || farmTools.includes(item)) {
        handleFarmSell(msg.author, item, amount, msg);
    } else {
        msg.channel.createMessage(`This is not a valid item!`);
    }
}

module.exports = { handleSellCommand }