const { getMoney, delMoney, addMoney, setLastPay, setPayAmount } = require("../../utils/user/money")
const { formatMoney } = require("../../utils/format/moneyUtils");
const { getProfile } = require("../../utils/user/user");

module.exports.Payment = {
    send: async function (client, msg, args) {
        let user = msg.mentions[0] || client.users.get(args[0]);
        if (!user) {
            msg.channel.createMessage(`You need to supply a user to send money to.`);
            return;
        }

        let amount = parseInt(args[1]);
        if(!amount || isNaN(amount)) {
            msg.channel.createMessage(`You need to supply a valid amount of money to send.`);
            return;
        }

        var senderBal = await getMoney(msg.author.id);
        if(senderBal < amount) {
            msg.channel.createMessage(`You don't have that much money!`);
            return;
        }

        var profile = await getProfile(msg.author.id);
        if(profile.econ.payment.payAmount + amount > 1000000) {
            if(profile.econ.payment.lastPay + 3600000 > Date.now()) {
                msg.channel.createMessage(`You can't pay more than $10,000,000 an hour! You have already paid $${profile.econ.payment.payAmount}`);
                return;
            } else {
                await setPayAmount(msg.author.id, 0);
            }
        }

        setLastPay(msg.author.id, Date.now());
        setPayAmount(msg.author.id, profile.econ.payment.payAmount + amount);

        await delMoney(msg.author.id, amount);
        await addMoney(user.id, amount);
        msg.channel.createMessage(`You have sent ${user.username} ${formatMoney(amount)}!`);
        return;
    }
}