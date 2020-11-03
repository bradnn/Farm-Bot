const { PresUtils } = require("./utils");
const { getMoney } = require("../../utils/user/money");
const { formatMoney } = require("../../utils/format/moneyUtils");

module.exports.PresHandlers = {
    handler: async function (client, msg, args) {
        var price = (await PresUtils.getPrestige(msg.author.id) + 1) * 2500000;
        var bal = await getMoney(msg.author.id);
        if (price <= bal) {
            msg.channel.createMessage(`Prestiging will reset all your progress but give you access to more features!
Are you sure you want to prestige? Type \`yes\` to continue.`);

            let responses = await msg.channel.awaitMessages(m => m.author.id == msg.author.id && m.content == "yes", { time: 30000, maxMatches: 1});
            if (responses.length) {
                var newPres = await PresUtils.prestige(msg.author.id);
                msg.channel.createMessage(`You have prestiged to prestige ${newPres}! Congrats!`);
                return;
            } else {
                return;
            }
        } else {
            msg.channel.createMessage(`You don't have enough money to prestige! You need ${formatMoney(price)}!`);
            return;
        }
    }
}