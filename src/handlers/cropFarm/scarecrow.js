const { cropGetScarecrows, cropGetProtected, cropAddProtected, cropAddScarecrowUse } = require("../../utils/farm/crop/user");

const handleScarecrow = async (msg, user) => {
    var scarecrows = await cropGetScarecrows(user.id);

    if (scarecrows < 1) {
        const scarecrowEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s scarecrow`
            },
            description: `You don't have a scarecrow!`
        };
    
        msg.channel.createMessage({embed: scarecrowEmbed}); // Sends message
        return;
    }

    var protected = await cropGetProtected(user.id);

    if(protected == true) {
        const scarecrowEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s scarecrow`
            },
            description: `Your farm is already protected!`
        };
    
        msg.channel.createMessage({embed: scarecrowEmbed}); // Sends message
        return;
    }

    cropAddProtected(user.id);
    cropAddScarecrowUse(user.id);
    const scarecrowEmbed = { // Creates embed Object
        author: {
            name: `${user.username}'s scarecrow`
        },
        description: `You have protected your farm and can no longer lose money from 1 harvest.`
    };

    msg.channel.createMessage({embed: scarecrowEmbed}); // Sends message
    return;


    
}

module.exports = { handleScarecrow };