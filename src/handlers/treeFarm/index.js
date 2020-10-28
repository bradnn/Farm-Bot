const { onCooldown } = require("../cooldown");
const { handleBugSpray } = require("./bugspray");
const { handleChainsaw } = require("./chainsaw");
const { treeSendFarm } = require("./tree");
const { treeHarvestFarm } = require("./harvest");
const { treeHandlePlant } = require("./plant");
const { treeShopHandler } = require("./Shop");

const treeCommandHandler = async (client, msg, args) => {

    if(!args[0]) {
        cropSendFarm(msg, msg.author);
        return;
    }
    const subCommand = args[0];

    switch (subCommand) {
        case "harvest":
            const cooldown = await onCooldown("treeHarvest", msg.author);
            if(cooldown.response) {
                msg.channel.createMessage(cooldown.embed);
                return;
            }
            treeHarvestFarm(msg, msg.author);
            break;
        case "plant":
            treeHandlePlant(msg, args, msg.author);
            break;
        case "scarecrow":
        case "protect":
            handleBugSpray(msg, msg.author);
            break;
        case "tractor":
        case "fertilize":
            handleChainsaw(msg, msg.author);
            break;
        case "market":
        case "shop":
            treeShopHandler(client, msg, args); // Calls shop handler
            break;
        default:
            let user = msg.mentions[0] || client.users.get(args[0]);
            if (!user) user = msg.author;
            treeSendFarm(msg, user);
            break;
    }
}

module.exports = { treeCommandHandler };