
const { addMoney } = require("../utils/user/money");

module.exports = class {
    constructor() {
        this.cmd = 'addcoins'
    }

    async run(client, msg, args) {
        var owners = client.config.ownerID;
        if(!owners.includes(msg.author.id)) {
            msg.channel.createMessage(`You don't have permission to do this.`);
            return;
        }

        let user = msg.mentions[0] || client.users.get(args[0]);
        if (!user) {
            msg.channel.createMessage(`You need to supply a user.`);
            return;
        }
        
        var amount = parseInt(args[1]);

        if (!amount || isNaN(amount)) {
            msg.channel.createMessage(`You need to supply a valid amount.`);
            return;
        } 

        await addMoney(user.id, amount);
        msg.channel.createMessage(`Added ${amount} to ${user.username}.`);
        return;

    }
}