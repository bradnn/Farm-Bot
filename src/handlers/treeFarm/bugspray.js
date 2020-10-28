const { treeAddSprayed, treeAddSprayUse, treeGetSprayed, treeGetSpray } = require("../../utils/farm/tree/user");

const handleBugSpray = async (msg, user) => {
    var scarecrows = await treeGetSpray(user.id);

    if (scarecrows < 1) {
        const scarecrowEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s bugspray`
            },
            description: `You don't have bugspray!`
        };
    
        msg.channel.createMessage({embed: scarecrowEmbed}); // Sends message
        return;
    }

    var protected = await treeGetSprayed(user.id);

    if(protected == true) {
        const scarecrowEmbed = { // Creates embed Object
            author: {
                name: `${user.username}'s bugspray`
            },
            description: `Your tree farm is already protected!`
        };
    
        msg.channel.createMessage({embed: scarecrowEmbed}); // Sends message
        return;
    }

    treeAddSprayed(user.id);
    treeAddSprayUse(user.id);
    const bugprayEmbed = { // Creates embed Object
        author: {
            name: `${user.username}'s bugspray`
        },
        description: `You have protected your tree farm and can no longer lose money from 1 harvest.`
    };

    msg.channel.createMessage({embed: bugprayEmbed}); // Sends message
    return;


    
}

module.exports = { handleBugSpray };