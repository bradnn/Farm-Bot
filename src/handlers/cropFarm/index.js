const { cropShopHandler } = require("./Shop");

const cropCommandHandler = async (client, msg, args) => {

    if(!args[0]) {

    }
    const subCommand = args[0];

    switch (subCommand) {
        case "market":
        case "shop":
            cropShopHandler(client, msg, args); // Calls shop handler
            break;
    }
}

module.exports = { cropCommandHandler };