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
        var cropPrices = require("../../../handlers/cropFarm/Shop/Prices/farmPrices");
        var toolPrices = require("../../../handlers/cropFarm/Shop/Prices/toolPrices");

        var cropItems = Object.keys(cropPrices.prices);
        var toolItems = Object.keys(toolPrices.prices);

        if (cropItems.includes(item)) {
            x.inventory.crops[item] = x.inventory.crops[item] + amount;
        } else {
            x.inventory.items[item] = x.inventory.items[item] + amount;
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

        var cropPrices = require("../../../handlers/cropFarm/Shop/Prices/farmPrices");
        var toolPrices = require("../../../handlers/cropFarm/Shop/Prices/toolPrices");

        var cropItems = Object.keys(cropPrices.prices);
        var toolItems = Object.keys(toolPrices.prices);

        if (cropItems.includes(item)) {
            x.inventory.crops[item] = x.inventory.crops[item] - amount;
        } else {
            x.inventory.items[item] = x.inventory.items[item] - amount;
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

        var cropPrices = require("../../../handlers/cropFarm/Shop/Prices/farmPrices");
        var toolPrices = require("../../../handlers/cropFarm/Shop/Prices/toolPrices");

        var cropItems = Object.keys(cropPrices.prices);
        var toolItems = Object.keys(toolPrices.prices);

        if (cropItems.includes(item)) {
            itemCount = x.inventory.crops[item];
        } else {
            itemCount = x.inventory.items[item];
        }
        return itemCount;

    }
}