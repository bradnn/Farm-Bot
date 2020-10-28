const { treeHarvest } = require("../../utils/farm/tree/user");

const treeHarvestFarm = async (msg, user) => {
    var harvestAmount = await treeHarvest(user.id);

    const shopEmbed = { // Creates embed Object
        author: {
            name: `${user.username}'s harvest`
        },
        description: `You just chopped ${harvestAmount} trees!`
    };

    msg.channel.createMessage({embed: shopEmbed}); // Sends message
    return;
}

module.exports = { treeHarvestFarm };