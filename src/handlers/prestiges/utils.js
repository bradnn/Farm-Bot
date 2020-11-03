const profile = require("../../schemas/ProfileSchema")
const { CropUtils } = require('../crops/utils');
const { TreeUtils } = require('../trees/utils');

module.exports.PresUtils = {
    getPrestige: async function (userID) {
        let x = await profile.findOne({ userID: userID }, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = await profile.create({
                userID: userID
            });
        };

        return x.boosts.prestige.farmLevel;
    },
    prestige: async function (userID) {
        let x = await profile.findOne({ userID: userID }, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = await profile.create({
                userID: userID
            });
        };
        var types = ['crops', 'trees'];
        x.boosts.prestige.farmLevel += 1;
        x.econ.balance = 500;

        for (type in types) {
            type = types[type];
            switch(type) {
                case "crops":
                    var cropNames = Object.keys(CropUtils.getPrices("crops").prices);
                    var itemsNames = Object.keys(CropUtils.getPrices("items").prices);
                    break;
                case "trees":
                    var cropNames = Object.keys(TreeUtils.getPrices("crops").prices);
                    var itemsNames = Object.keys(TreeUtils.getPrices("items").prices);
                    break;
            }

            for (crop in cropNames) {
                crop = cropNames[crop];

                x.farms[type][crop] = 0;
                x.inventory.farms[type][crop] = 0;
            }

            for (item in itemsNames) {
                item = itemsNames[item];

                x.inventory.items.farmTools[type][item];
            }
        }

        x.save();
        return x.boosts.prestige.farmLevel;
    }

}