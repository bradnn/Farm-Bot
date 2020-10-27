const { cropHarvest } = require("../../utils/farm/crop/user");

const cropHarvestFarm = async (msg, user) => {
    var harvestAmount = await cropHarvest(user.id);

    const shopEmbed = { // Creates embed Object
        author: {
            name: `${user.username}'s harvest`
        },
        description: `You just harvested ${harvestAmount} crops!`
    };

    msg.channel.createMessage({embed: shopEmbed}); // Sends message
    return;
}

module.exports = { cropHarvestFarm };