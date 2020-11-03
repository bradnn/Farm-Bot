const profile = require("../../schemas/ProfileSchema");
const auctionSchem = require("../../schemas/AuctionSchema");
const { GemUtils } = require("../../utils/user/gems");
const { delMoney, addMoney } = require("../../utils/user/money");
const { addItem } = require("../../utils/farm/items/items");

module.exports.AuctionUtils = {
	getCollection: async function (userID) {
		let x = await profile.findOne({ userID: userID }, async function (
			err,
			res
		) {
			if (err) throw err;
			if (res) {
				return res;
			}
		});

		if (!x) {
			x = await profile.create({
				userID: userID,
			});
		}
		return x.collections;
	},
	addRarity: async function (userID, item) {
		let x = await profile.findOne({ userID: userID }, async function (
			err,
			res
		) {
			if (err) throw err;
			if (res) {
				return res;
			}
		});

		if (!x) {
			x = await profile.create({
				userID: userID,
			});
		}

		x.collections.raritys[item]++;
		x.save();

		return x.collections.raritys[item];
	},
	rarityAuction: async function (arg, user) {
		let x = await auctionSchem.findOne({userID: "768560813182943274"}, async function (err, res) {
			if(err) throw err;
			if (res) {
				return res;
			}
		});
		if (!x) {
			x = await auctionSchem.create({
				userID: "768560813182943274"
			});
		}
		switch (arg) {
			case "get":
                if(x.rarityAuction.auction.endTime - 900 < Date.now()) {
					var itemList = Object.keys(require('./auctionItems/rarity').items);
					var startBids = Object.values(require('./auctionItems/rarity').items);
					var selection = Math.floor(Math.random() * itemList.length);
					var item = itemList[selection];
					var startBid = startBids[selection];

					let y = await profile.findOne({userID: x.rarityAuction.lastBidder.userID}, async function (err, res) {
						if(err) throw err;
						if (res) {
							return res;
						}
					});
					if (!y) {
						y = await profile.create({
							userID: x.rarityAuction.lastBidder.userID
						});
					}

					y.collections.raritys[x.rarityAuction.auction.item] += x.rarityAuction.auction.amount;
					y.save();
					

					x.rarityAuction.auction.item = item;
					x.rarityAuction.auction.amount = Math.floor(Math.random() * 1) + 1;
					x.rarityAuction.auction.startingBid = startBid;
					x.rarityAuction.auction.bidType = "Gems";
					x.rarityAuction.auction.increment = 15;
					x.rarityAuction.auction.endTime = Date.now() + 10800000; // 6 hours = 21600000
					x.rarityAuction.auction.curBid = startBid;

					x.rarityAuction.lastBidder.userID = "No bidder";
					x.rarityAuction.lastBidder.amount = 0;
					x.save();
					return x.rarityAuction.auction;
				} else {
					return x.rarityAuction.auction;
				}
			case "bid":
				switch(x.rarityAuction.auction.bidType) {
					case "Gems":
						var bidAmount = x.rarityAuction.auction.curBid + x.rarityAuction.auction.increment;
						await GemUtils.del(user.id, bidAmount);

						if(!x.rarityAuction.lastBidder.userID == "No bidder") {
							GemUtils.add(x.rarityAuction.lastBidder.userID, x.rarityAuction.lastBidder.amount);
						}
						x.rarityAuction.auction.curBid = bidAmount;
						x.rarityAuction.lastBidder.userID = user.id;
						x.rarityAuction.lastBidder.amount = bidAmount;
						x.save();
						return;
					case "Coins":
						return;
				}
				return;
		}
	},
	packageAuction: async function (arg, user) {
		let x = await auctionSchem.findOne({userID: "768560813182943274"}, async function (err, res) {
			if(err) throw err;
			if (res) {
				return res;
			}
		});
		if (!x) {
			x = await auctionSchem.create({
				userID: "768560813182943274"
			});
		}
		switch (arg) {
			case "get":
                if(x.packageAuction.auction.endTime - 900 < Date.now()) {
					var itemList = Object.keys(require('./auctionItems/package').items);
					var startBids = Object.values(require('./auctionItems/package').items);
					var selection = Math.floor(Math.random() * itemList.length);
					var item = itemList[selection];
					var startBid = startBids[selection];

					if(!x.packageAuction.lastBidder.userID == "No bidder") {
						addItem(x.packageAuction.lastBidder.userID, x.packageAuction.auction.item, x.packageAuction.auction.amount);
					}

					x.packageAuction.auction.item = item;
					x.packageAuction.auction.amount = Math.floor(Math.random() * 10) + 1;
					x.packageAuction.auction.startingBid = startBid;
					x.packageAuction.auction.bidType = "Coins";
					x.packageAuction.auction.increment = 15000;
					x.packageAuction.auction.endTime = Date.now() + 30000; // 6 hours = 21600000
					x.packageAuction.auction.curBid = startBid;

					x.packageAuction.lastBidder.userID = "No bidder";
					x.packageAuction.lastBidder.amount = 0;
					x.save();
					return x.packageAuction.auction;
				} else {
					return x.packageAuction.auction;
				}
			case "bid":
				console.log('bidding...')
				switch(x.packageAuction.auction.bidType) {
					case "Coins":
						console.log('YEAH');
						var bidAmount = x.packageAuction.auction.curBid + x.packageAuction.auction.increment;
						await delMoney(user.id, bidAmount);

						if(!x.packageAuction.lastBidder.userID == "No bidder") {
							addMoney(x.packageAuction.lastBidder.userID, x.packageAuction.lastBidder.amount);
						}
						x.packageAuction.auction.curBid = bidAmount;
						x.packageAuction.lastBidder.userID = user.id;
						x.packageAuction.lastBidder.amount = bidAmount;
						x.save();
						return;
					case "Gems":
						console.log('yeah');
						return;
				}
				return;
		}
	},
};
