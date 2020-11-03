const mongoose = require('mongoose');

const auctionSchema = mongoose.Schema({
    userID: {
        type: String,
        default: 768560813182943274
    },
    rarityAuction: {
        auction: {
            item: {
                type: String,
                default: "royalGem"
            },
            amount: {
                type: Number,
                default: 1
            },
            startingBid: {
                type: Number,
                default: 300
            },
            bidType: {
                type: String,
                default: "Gems"
            },
            increment: {
                type: Number,
                default: 15
            },
            curBid: {
                type: Number,
                default: 0
            },
            endTime: {
                type: Date,
                default: 0
            }
        },
        lastBidder: {
            userID: {
                type: String,
                default: "No bidder"
            },
            amount: {
                type: Number,
                default: 0
            }
        }
    },
    packageAuction: {
        auction: {
            item: {
                type: String,
                default: "tractor"
            },
            amount: {
                type: Number,
                default: 15
            },
            startingBid: {
                type: Number,
                default: 150000
            },
            bidType: {
                type: String,
                default: "Coins"
            },
            increment: {
                type: Number,
                default: 1000
            },
            curBid: {
                type: Number,
                default: 0
            },
            endTime: {
                type: Date,
                default: 0
            }
        },
        lastBidder: {
            userID: {
                type: String,
                default: "No bidder"
            },
            amount: {
                type: Number,
                default: 0
            }
        }
    },
});

module.exports = mongoose.model("Auction", auctionSchema);