const { cropGetTractors, cropGetFertilized, cropAddFertilize } = require("../../utils/farm/crop/user");

const handleTractor = async (msg, user) => {
    var scarecrows = await cropGetTractors(user.id);

    if (scarecrows < 1) {
        const scarecrowEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s tractor`
            },
            description: `You don't have a tractor!`
        };
    
        msg.channel.createMessage({embed: scarecrowEmbed}); // Sends message
        return;
    }

    var protected = await cropGetFertilized(user.id);

    if(protected == true) {
        const scarecrowEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s tractor`
            },
            description: `Your farm is already fertilized!`
        };
    
        msg.channel.createMessage({embed: scarecrowEmbed}); // Sends message
        return;
    }

    cropAddFertilize(user.id);
    cropAddTractorUse(user.id);
    const scarecrowEmbed = { // Creates embed Object
        author: {
            name: `${user.username}'s tractor`
        },
        description: `You have fertilized your farm and shortened your cooldown by 50%`
    };

    msg.channel.createMessage({embed: scarecrowEmbed}); // Sends message
    return;


    
}

module.exports = { handleTractor };