const { handleCropSell } = require("../../utils/farm/crop/shop");
const { handleTreeSell } = require("../../utils/farm/tree/shop");

const handleSellCommand = async (client, msg, args) => {
    let item = args[0];
    let amount = parseInt(args[1]);

    if(!amount || amount == null || amount == undefined || amount < 0) {
        amount = 1
    }

    // CROP FARMING REQUIREMENTS

    var cropPrices = require("../cropFarm/Shop/Prices/farmPrices");
    var cropTools = require("../cropFarm/Shop/Prices/toolPrices");
    cropPrices = Object.keys(cropPrices.prices);
    cropTools = Object.keys(cropTools.prices);

    // TREE FARMING REQUIREMENTS

    var treePrices = require("../treeFarm/Shop/Prices/farmPrices");
    var treeTools = require("../treeFarm/Shop/Prices/toolPrices");
    treePrices = Object.keys(treePrices.prices);
    treeTools = Object.keys(treeTools.prices);

    if (cropPrices.includes(item) || cropTools.includes(item)) {
        handleCropSell(msg.author, item, amount, msg);
        return;
    } else if (treePrices.includes(item) || treeTools.includes(item)) {
        handleTreeSell(msg.author, item, amount, msg);
        return;
    } else {
        msg.channel.createMessage(`This is not a valid item!`);
        return;
    }
}

module.exports = { handleSellCommand }