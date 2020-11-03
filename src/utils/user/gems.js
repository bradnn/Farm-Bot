const profile = require("../../schemas/ProfileSchema");

module.exports.GemUtils = {
	get: async function (userID) {
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
        
        return x.econ.gems;
	},
	add: async function (userID, amount) {
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

        x.econ.gems += amount;
        x.save();
        
        return x.econ.gems;
	},
	del: async function (userID, amount) {
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

        x.econ.gems -= amount;
        x.save();
        
        return x.econ.gems;
	},
};
