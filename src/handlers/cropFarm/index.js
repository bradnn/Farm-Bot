const { onCooldown } = require("../cooldown");
const { cropSendFarm } = require("./farm");
const { cropHarvestFarm } = require("./harvest");
const { cropHandlePlant } = require("./plant");
const { handleScarecrow } = require("./scarecrow");
const { cropShopHandler } = require("./Shop");
const { handleTractor } = require("./tractor");

const cropCommandHandler = async (client, msg, args) => {

    if(!args[0]) {
        cropSendFarm(msg, msg.author);
        return;
    }
    const subCommand = args[0];

    switch (subCommand) {
        case "harvest":
            const cooldown = await onCooldown("cropHarvest", msg.author);
            if(cooldown.response) {
                msg.channel.createMessage(cooldown.embed);
                return;
            }
            cropHarvestFarm(msg, msg.author);
            break;
        case "plant":
            cropHandlePlant(msg, args, msg.author);
            break;
        case "scarecrow":
        case "protect":
            handleScarecrow(msg, msg.author);
            break;
        case "tractor":
        case "fertilize":
            handleTractor(msg, msg.author);
            break;
        case "market":
        case "shop":
            cropShopHandler(client, msg, args); // Calls shop handler
            break;
        default:
            let user = msg.mentions[0] || client.users.get(args[0]);
            if (!user) user = msg.author;
            cropSendFarm(msg, user);
            break;
    }
}

module.exports = { cropCommandHandler };