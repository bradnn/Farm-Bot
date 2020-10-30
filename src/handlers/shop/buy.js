const { CropShop } = require("../crops/Shop");
const { TreeShop } = require("../trees/Shop");

const handleBuyCommand = async (client, msg, args) => {
    let item = args[0];
    let amount = parseInt(args[1]);

    if(!amount || amount == null || amount == undefined || amount < 0) {
        amount = 1
    }

    // CROP FARMING REQUIREMENTS

    var cropPrices = require("../crops/Shop/Prices/farmPrices");
    var cropTools = require("../crops/Shop/Prices/toolPrices");
    cropPrices = Object.keys(cropPrices.prices);
    cropTools = Object.keys(cropTools.prices);

    // TREE FARMING REQUIREMENTS

    var treePrices = require("../trees/Shop/Prices/farmPrices");
    var treeTools = require("../trees/Shop/Prices/toolPrices");
    treePrices = Object.keys(treePrices.prices);
    treeTools = Object.keys(treeTools.prices);

    if(cropPrices.includes(item) || cropTools.includes(item)) {
        CropShop.handleBuy(msg.author, item, amount, msg);
        return;
    } else if (treePrices.includes(item) || treeTools.includes(item)) {
        TreeShop.handleBuy(msg.author, item, amount, msg);
        return;
    } else {
        msg.channel.createMessage(`This is not a valid item!`);
        return;
    }
    
}

module.exports = { handleBuyCommand }