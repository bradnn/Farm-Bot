const { cropHarvest, cropPlantAll, cropGetCrops, cropPlant } = require("../../utils/farm/crop/user");

const cropHandlePlant = async (msg, args, user) => {

    var type = args[1];
    var amount = parseInt(args[2]);

    if (type == "all") {
        var planted = await cropPlantAll(user.id);
        const plantEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s planting`
            },
            description: `You just planted ${planted} crops!`
        };

        msg.channel.createMessage({ embed: plantEmbed }); // Sends message
        return;
    }

    if (!amount || amount == null || amount < 1) {
        amount = 1;
    }

    var userCrops = await cropGetCrops(user.id);
    var farmPrices = require("./Shop/Prices/farmPrices"); // Grabs crop prices
    var validItems = Object.keys(farmPrices.prices);

    if (validItems.includes(type)) {

        if (userCrops[type] > amount) {
            cropPlant(user.id, type, amount);

            const plantEmbed = { // Creates embed Object
                author: {
                    name: `${user.username}'s planting`
                },
                description: `You just planted ${amount} ${type}!`
            };

            msg.channel.createMessage({ embed: plantEmbed }); // Sends message
            return;
        }


        const plantEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s planting`
            },
            description: `You don't have ${amount}x ${type}!`
        };

        msg.channel.createMessage({ embed: plantEmbed }); // Sends message

        return;
    } else {


        const plantEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s planting`
            },
            description: `${type} is not a valid plant!`
        };

        msg.channel.createMessage({ embed: plantEmbed }); // Sends message

        return;
    }


}

module.exports = { cropHandlePlant };