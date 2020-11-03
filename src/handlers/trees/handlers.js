var { getFarm, harvest } = require("./utils").TreeUtils;
const { handleShop } = require("./Shop/index.js").TreeShop;
const { formatItems } = require("../../utils/format/itemUtils");
const { onCooldown } = require("../cooldown/index");
const { PresUtils } = require("../prestiges/utils");

var farmPrices = require("./Shop/Prices/farmPrices");
var toolPrices = require("./Shop/Prices/toolPrices");
const { TreeUtils } = require("./utils");

module.exports.TreeHandlers = {
	handler: async function (client, msg, args) {
		var userPres = await PresUtils.getPrestige(msg.author.id);

		if (userPres < 3) {
			msg.channel.createMessage(`You need to be prestige 3 to have a tree farm!
Prestige with \`${client.config.PREFIX}prestige\``);
			return;
		}

		if (!args[0]) {
			this.sendFarm(msg, msg.author);
			return;
		}
		const subCommand = args[0];
		switch (subCommand) {
			case "harvest":
				const cooldown = await onCooldown("treeHarvest", msg.author);
				if (cooldown.response) {
					msg.channel.createMessage(cooldown.embed);
					return;
				}
				this.harvest(msg, msg.author);
				break;
			case "plant":
				this.plant(msg, args, msg.author);
				break;
			case "spray":
			case "bugspray":
			case "protect":
				this.bugspray(msg, msg.author);
				break;
			case "axe":
			case "efficient":
				this.axe(msg, msg.author);
				break;
			case "market":
			case "shop":
				handleShop(client, msg, args);
				break;
			default:
				let user = msg.mentions[0] || client.users.get(args[0]);
				if (!user) user = msg.author;
				this.sendFarm(msg, msg.author);
				return;
		}
	},
	sendFarm: async function (msg, user) {
		var farm = await getFarm(user.id);

		const treeEmbed = { author: { name: `${user.username}'s trees` } }; // Defines embed
		var itemString = ``;

		for (item in farmPrices.prices) {
			itemString =
				itemString +
				`${farmPrices.emojis[item]} ${item} **-** ${formatItems(farm[item])}\n`; // Adds a line for every tree
		}

		// ADD ITEMSTRING TO EMBED
		treeEmbed.fields = [
			{
				name: `Trees`,
				value: itemString,
			},
		];

		msg.channel.createMessage({ embed: treeEmbed });
		return;
	},
	harvest: async function (msg, user) {
		var harvestAmount = await harvest(user.id);

		const shopEmbed = {
			// Creates embed Object
			author: {
				name: `${user.username}'s harvest`,
			},
			description: `You just harvested ${harvestAmount} crops!`,
		};

		msg.channel.createMessage({ embed: shopEmbed }); // Sends message
		return;
	},
	plant: async function (msg, args, user) {
		var type = args[1];
		var amount = parseInt(args[2]);

		if (type == "all") {
			var planted = await TreeUtils.plantAll(user.id);
			const plantEmbed = {
				author: { name: `${user.username}'s planting` },
				description: `You just planted ${planted} crops!`,
			};
			msg.channel.createMessage({ embed: plantEmbed });
			return;
		}

		if (!amount || amount == null || amount < 1) amount = 1;

		var userCrops = await TreeUtils.getCrops(user.id);
		var farmPrices = TreeUtils.getPrices("crops");
		var validItems = Object.keys(farmPrices.prices);

		if (validItems.includes(type)) {
			if (userCrops[type] > amount) {
				TreeUtils.plant(user.id, type, amount);
				const plantEmbed = {
					// Creates embed Object
					author: {
						name: `${user.username}'s planting`,
					},
					description: `You just planted ${amount} ${type}!`,
				};
				msg.channel.createMessage({ embed: plantEmbed });
				return;
			}
			const plantEmbed = {
				// Creates embed Object
				author: {
					name: `${user.username}'s planting`,
				},
				description: `You don't have ${amount}x ${type}!`,
			};
			msg.channel.createMessage({ embed: plantEmbed }); // Sends message
			return;
		} else {
			const plantEmbed = {
				// Creates embed Object
				author: {
					name: `${user.username}'s planting`,
				},
				description: `${type} is not a valid plant!`,
			};
			msg.channel.createMessage({ embed: plantEmbed }); // Sends message
			return;
		}
	},
	axe: async function (msg, user) {
		var items = await TreeUtils.getAxes(user.id);

		if (items < 1) {
			const errEmbed = {
				// Creates error embed Object
				author: {
					name: `${user.username}'s axe`,
				},
				description: `You don't have an axe!`,
			};

			msg.channel.createMessage({ embed: errEmbed }); // Sends message
			return;
		}

		var valid = await TreeUtils.getAxed(user.id);
		if (valid == true) {
			const errEmbed = {
				// Creates error embed Object
				author: {
					name: `${user.username}'s axe`,
				},
				description: `Your farm is already efficienct!`,
			};
			msg.channel.createMessage({ embed: errEmbed }); // Sends message
			return;
		}

		TreeUtils.addAxed(user.id);
		TreeUtils.addAxeUse(user.id);
		const successEmbed = {
			// Creates embed Object
			author: {
				name: `${user.username}'s axe`,
			},
			description: `You have increased your tree farms efficiency and reduced the cooldown by 50% for 1 use.`,
		};
		msg.channel.createMessage({ embed: successEmbed }); // Sends message
		return;
	},
	bugspray: async function (msg, user) {
		var items = await TreeUtils.getSprays(user.id);

		if (items < 1) {
			const errEmbed = {
				// Creates error embed Object
				author: {
					name: `${user.username}'s bugspray`,
				},
				description: `You don't have bugspray!`,
			};

			msg.channel.createMessage({ embed: errEmbed }); // Sends message
			return;
		}

		var valid = await TreeUtils.getSprayed(user.id);
		if (valid == true) {
			const errEmbed = {
				// Creates error embed Object
				author: {
					name: `${user.username}'s bugspray`,
				},
				description: `Your farm is already clean!`,
			};
			msg.channel.createMessage({ embed: errEmbed }); // Sends message
			return;
		}

		TreeUtils.addSprayed(user.id);
		TreeUtils.addSprayUse(user.id);
		const successEmbed = {
			// Creates embed Object
			author: {
				name: `${user.username}'s bugspray`,
			},
			description: `You have cleaned your farm and can no longer loose money from 1 harvest!`,
		};
		msg.channel.createMessage({ embed: successEmbed }); // Sends message
		return;
	},
};
