const { Payment } = require("../handlers/bank/handlers");

module.exports = class {
    constructor() {
        this.cmd = 'sendmoney'
    }

    async run(client, msg, args) {

        var handle = await Payment.send(client, msg, args);
        return handle;

    }
}