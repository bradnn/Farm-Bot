const { msToTime } = require("../../utils/format/timeUtils");
const { GemUtils } = require("../../utils/user/gems");
const { getMoney } = require("../../utils/user/money");
const { PresUtils } = require("../prestiges/utils");
const { AuctionUtils } = require("./utils");

module.exports.AuctionHandlers = {
	handle: async function (client, msg, args) {
		var userPres = await PresUtils.getPrestige(msg.author.id);
		if (userPres < 5) {
			msg.channel.createMessage(`You need to be prestige 5 to access the auction house!
Prestige with \`-prestige\``);
			return;
		}

		if (!args[0]) {
            this.menu(msg, msg.author, client);
		}
		var type = args[0];

		switch(type) {
			case "bid":
				var bidType = args[1].toLowerCase();
				console.log(bidType);
				var types = ['rarity', 'package'];
				if(!types.includes(bidType)) {
					msg.channel.createMessage(`That is not a valid type of auction`);
					return;
				}
				this.bid(msg, msg.author, bidType);
				return;
		}
	},
	menu: async function (msg, client) {
		var rarityAuction = await AuctionUtils.rarityAuction("get");
		var packageAuction = await AuctionUtils.packageAuction("get");
		var items = require('./auctionItems/rarity');
		var pitems = require('./auctionItems/package');

		var timeLeftRarity = msToTime(rarityAuction.endTime - Date.now());
		var timeLeftPackage = msToTime(packageAuction.endTime - Date.now());

		var shopEmbed = {
            title: `AUCTION HOUSE`,
            description: `Bid on extremely rare items and grow your collection!`,
            color: 65433,
			fields: [
				{
					name: `RARITY AUCTION`,
                    value: `${items.emojis[rarityAuction.item]} ${rarityAuction.amount}x ${items.formatName[rarityAuction.item]}**:**
Current Bid **-** ${rarityAuction.curBid} ${rarityAuction.bidType}
Bid Increment **-** ${rarityAuction.increment} ${rarityAuction.bidType}
Ending in **-** ${timeLeftRarity}`,
                },
				{
					name: `PACKAGE AUCTION`,
                    value: `${pitems.emojis[packageAuction.item]} ${packageAuction.amount}x ${pitems.formatName[packageAuction.item]}**:**
Current Bid **-** ${packageAuction.curBid} ${packageAuction.bidType}
Bid Increment **-** ${packageAuction.increment} ${packageAuction.bidType}
Ending in **-** ${timeLeftPackage}`,
                },
            ],
            footer: {
                text: `Do -collection to view your items!`
            }
		};
		msg.channel.createMessage({ embed: shopEmbed });
	},
	bid: async function (msg, user, type) { 
		switch (type) {
			case "rarity":
				var rarityAuction = await AuctionUtils.rarityAuction("get");
				var items = require('./auctionItems/rarity');

				switch(rarityAuction.bidType) {
					case "Gems":
						var bidAmount = rarityAuction.curBid + rarityAuction.increment;
						var theirGems = await GemUtils.get(user.id);

						if(theirGems >= bidAmount) {
							AuctionUtils.rarityAuction("bid", user);
							msg.channel.createMessage(`You bid on ${rarityAuction.amount}x ${items.formatName[rarityAuction.item]} for ${bidAmount} Gems`);
							return;
						} else {
							msg.channel.createMessage(`You don't have enough money to bid on this item. You need ${bidAmount} gems`);
							return;
						}
						return;
				}
				return;
			case "package":
				var packageAuction = await AuctionUtils.packageAuction("get");
				var items = require('./auctionItems/package');

				switch(packageAuction.bidType) {
					case "Coins":
						var bidAmount = packageAuction.curBid + packageAuction.increment;
						var theirCoins = await getMoney(user.id);

						if(theirCoins >= bidAmount) {
							AuctionUtils.packageAuction("bid", user);
							msg.channel.createMessage(`You bid on ${packageAuction.amount}x ${items.formatName[packageAuction.item]} for ${bidAmount} Gems`);
							return;
						} else {
							msg.channel.createMessage(`You don't have enough money to bid on this item. You need ${bidAmount} Coins`);
							return;
						}
						return;
				}
				return;
		}
	},
};
