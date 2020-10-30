var { getFarm, harvest } = require('./utils').CropUtils;
const { handleShop } = require('./Shop/index.js').CropShop;
const { formatItems } = require('../../utils/format/itemUtils');
const { onCooldown } = require('../cooldown/index');

var farmPrices = require('./Shop/Prices/farmPrices');
var toolPrices = require('./Shop/Prices/toolPrices');
const { CropUtils } = require('./utils');

module.exports.CropHandlers = {
    handler: async function (client, msg, args) {
        if(!args[0]) {
            this.sendFarm(msg, msg.author);
            return;
        }
        const subCommand = args[0].toLowerCase();
        switch(subCommand) {
            case "harvest":
                const cooldown = await onCooldown("cropHarvest", msg.author);
                if (cooldown.response) {
                    msg.channel.createMessage(cooldown.embed);
                    return;
                }
                this.harvest(msg, msg.author);
                break;
            case "plant":
                this.plant(msg, args, msg.author);
                break;
            case "scarecrow":
            case "scare":
            case "protect":
                this.scarecrow(msg, msg.author);
                break;
            case "tractor":
            case "efficient":
            case "fertilize":
                this.tractor(msg, msg.author);
                break;
            case "market":
            case "shop":
                handleShop(client, msg, args);
                break;
            default:
                let user = msg.mentions[0] || client.users.get(args[0]);
                if (!user) user = msg.author;
                this.sendFarm(msg, msg.author);
                return;
        }
    },
    sendFarm: async function (msg, user) {
        var farm = await getFarm(user.id);

        const cropEmbed = { author: { name: `${user.username}'s crops` }}; // Defines embed
        var itemString = ``;

        for (item in farmPrices.prices) {
            itemString = itemString + `${farmPrices.emojis[item]} ${item} **-** ${formatItems(farm[item])}\n` // Adds a line for every tree
        }

        // ADD ITEMSTRING TO EMBED
        cropEmbed.fields = [{
            name: `Crops`,
            value: itemString
        }];

        msg.channel.createMessage({embed: cropEmbed});
        return;
    },
    harvest: async function (msg, user) {
        var harvestAmount = await harvest(user.id);
    
        const shopEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s harvest`
            },
            description: `You just harvested ${harvestAmount} crops!`
        };
    
        msg.channel.createMessage({embed: shopEmbed}); // Sends message
        return;
    },
    plant: async function (msg, args, user) {
        var type = args[1];
        var amount = parseInt(args[2]);

        if (type == "all") {
            var planted = await CropUtils.plantAll(user.id);
            const plantEmbed = { author: { name: `${user.username}'s planting` }, description: `You just planted ${planted} crops!`};
            msg.channel.createMessage({embed: plantEmbed});
            return;
        };

        if (!amount || amount == null || amount < 1) amount = 1;

        var userCrops = await CropUtils.getCrops(user.id);
        var farmPrices = CropUtils.getPrices("crops");
        var validItems = Object.keys(farmPrices.prices);
        
        if (validItems.includes(type)) {
            if (userCrops[type] > amount) {
                CropUtils.plant(user.id, type, amount);
                const plantEmbed = { // Creates embed Object
                    author: {
                        name: `${user.username}'s planting`
                    },
                    description: `You just planted ${amount} ${type}!`
                };
                msg.channel.createMessage({embed: plantEmbed});
                return;
            };
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
        };
    },
    tractor: async function (msg, user) {
        var items = await CropUtils.getTractors(user.id);

        if(items < 1) {
            const errEmbed = { // Creates error embed Object
                author: {
                    name: `${user.username}'s tractor`
                },
                description: `You don't have a tractor!`
            }
    
            msg.channel.createMessage({embed: errEmbed}); // Sends message
            return;
        }

        var valid = await CropUtils.getFertilized(user.id);
        if (valid == true) {
            const errEmbed = { // Creates error embed Object
                author: {
                    name: `${user.username}'s tractor`
                },
                description: `Your farm is already fertilized!`
            };
            msg.channel.createMessage({embed: errEmbed}); // Sends message
            return;
        }

        CropUtils.addFertilized(user.id);
        CropUtils.addTractorUse(user.id);
        const successEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s tractor`
            },
            description: `You have increased your crop farms efficiency and reduced the cooldown by 50% for 1 use.`
        };
        msg.channel.createMessage({embed: successEmbed}); // Sends message
        return;
    },
    scarecrow: async function (msg, user) {
        var items = await CropUtils.getScarecrows(user.id);

        if(items < 1) {
            const errEmbed = { // Creates error embed Object
                author: {
                    name: `${user.username}'s scarecrow`
                },
                description: `You don't have scarecrow!`
            }
    
            msg.channel.createMessage({embed: errEmbed}); // Sends message
            return;
        }

        var valid = await CropUtils.getProtected(user.id);
        if (valid == true) {
            const errEmbed = { // Creates error embed Object
                author: {
                    name: `${user.username}'s scarecrow`
                },
                description: `Your farm is already protected!`
            };
            msg.channel.createMessage({embed: errEmbed}); // Sends message
            return;
        }

        CropUtils.addProtected(user.id);
        CropUtils.addScarecrowUse(user.id);
        const successEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s scarecrow`
            },
            description: `You have protected your farm and can no longer loose money from 1 harvest!`
        };
        msg.channel.createMessage({embed: successEmbed}); // Sends message
        return;
    }
};