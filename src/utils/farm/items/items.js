const profile = require('../../../schemas/ProfileSchema');

module.exports = {

    addItem: async function (userID, item, amount) {
        let x = await profile.findOne({ userID: userID }, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        })

        if (!x) {
            x = await profile.create({
                userID: userID
            });
        }
        var cropPrices = require("../../../handlers/crops/Shop/Prices/farmPrices");
        var cropToolPrices = require("../../../handlers/crops/Shop/Prices/toolPrices");
        var treePrices = require("../../../handlers/trees/Shop/Prices/farmPrices");
        var treeToolPrices = require("../../../handlers/trees/Shop/Prices/toolPrices");

        var cropItems = Object.keys(cropPrices.prices);
        var cropToolItems = Object.keys(cropToolPrices.prices);
        var treeItems = Object.keys(treePrices.prices);
        var treeToolItems = Object.keys(treeToolPrices.prices);

        if (cropItems.includes(item)) {
            x.inventory.farms.crops[item] = x.inventory.farms.crops[item] + amount;
        } else if (cropToolItems.includes(item)) {
            x.inventory.items.farmTools.crops[item] = x.inventory.items.farmTools.crops[item] + amount;
        } else if (treeItems.includes(item)) {
            x.inventory.farms.trees[item] = x.inventory.farms.trees[item] + amount;
        } else if (treeToolItems.includes(item)) {
            x.inventory.items.farmTools.trees[item] = x.inventory.items.farmTools.crops[item] + amount;
        }

        x.save();
        return x;

    },
    delItem: async function (userID, item, amount, type) {
        let x = await profile.findOne({ userID: userID }, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        })

        if (!x) {
            x = await profile.create({
                userID: userID
            });
        }

        var cropPrices = require("../../../handlers/crops/Shop/Prices/farmPrices");
        var cropToolPrices = require("../../../handlers/crops/Shop/Prices/toolPrices");
        var treePrices = require("../../../handlers/trees/Shop/Prices/farmPrices");
        var treeToolPrices = require("../../../handlers/trees/Shop/Prices/toolPrices");

        var cropItems = Object.keys(cropPrices.prices);
        var cropToolItems = Object.keys(cropToolPrices.prices);
        var treeItems = Object.keys(treePrices.prices);
        var treeToolItems = Object.keys(treeToolPrices.prices);

        if (cropItems.includes(item)) {
            x.inventory.farms.crops[item] = x.inventory.farms.crops[item] - amount;
        } else if (cropToolItems.includes(item)) {
            x.inventory.items.farmTools.crops[item] = x.inventory.items.farmTools.crops[item] - amount;
        } else if (treeItems.includes(item)) {
            x.inventory.farms.trees[item] = x.inventory.farms.trees[item] - amount;
        } else if (treeToolItems.includes(item)) {
            x.inventory.items.farmTools.trees[item] = x.inventory.items.farmTools.crops[item] - amount;
        }
        x.save();
        return x;

    },
    getItem: async function (userID, item) {
        let x = await profile.findOne({ userID: userID }, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        })

        if (!x) {
            x = await profile.create({
                userID: userID
            });
        }

        var itemCount;

        var cropPrices = require("../../../handlers/crops/Shop/Prices/farmPrices");
        var cropToolPrices = require("../../../handlers/crops/Shop/Prices/toolPrices");
        var treePrices = require("../../../handlers/trees/Shop/Prices/farmPrices");
        var treeToolPrices = require("../../../handlers/trees/Shop/Prices/toolPrices");

        var cropItems = Object.keys(cropPrices.prices);
        var cropToolItems = Object.keys(cropToolPrices.prices);
        var treeItems = Object.keys(treePrices.prices);
        var treeToolItems = Object.keys(treeToolPrices.prices);

        if (cropItems.includes(item)) {
            itemCount = x.inventory.farms.crops[item];
        } else if (cropToolItems.includes(item)) {
            itemCount = x.inventory.items.farmTools.crops[item];
        } else if (treeItems.includes(item)) {
            itemCount = x.inventory.farms.trees[item];
        } else if (treeToolItems.includes(item)) {
            itemCount = x.inventory.items.farmTools.crops[item];
        }
        return itemCount;

    }
}