const mongoose = require('mongoose');

const townhallSchema = mongoose.Schema({
    userID: {
        type: String,
        default: 768560813182943274
    },
    contributions: {
        amount: {
            type: Number,
            default: 0
        }
    }
});

module.exports = mongoose.model("Townhall", townhallSchema);