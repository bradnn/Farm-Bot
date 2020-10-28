const { treeGetSaws, treeGetSawed, treeAddSawed, treeAddSawUse } = require("../../utils/farm/tree/user");

const handleChainsaw = async (msg, user) => {
    var scarecrows = await treeGetSaws(user.id);

    if (scarecrows < 1) {
        const scarecrowEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s chainsaw`
            },
            description: `You don't have a chainsaw!`
        };
    
        msg.channel.createMessage({embed: scarecrowEmbed}); // Sends message
        return;
    }

    var protected = await treeGetSawed(user.id);

    if(protected == true) {
        const scarecrowEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s chainsaw`
            },
            description: `Your farm is already sawed!`
        };
    
        msg.channel.createMessage({embed: scarecrowEmbed}); // Sends message
        return;
    }

    treeAddSawed(user.id);
    treeAddSawUse(user.id);
    const chainsawEmbed = { // Creates embed Object
        author: {
            name: `${user.username}'s chainsaw`
        },
        description: `You have sawed some trees and shortened your cooldown by 50%`
    };

    msg.channel.createMessage({embed: chainsawEmbed}); // Sends message
    return;


    
}

module.exports = { handleChainsaw };