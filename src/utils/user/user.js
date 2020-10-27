const profile = require('../../schemas/ProfileSchema');

module.exports = {
    getProfile: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) {
            if (err) throw err;
            if(res) {
                return res;
            }
        })

        if(!x) {
            x = await profile.create({
                userID: userID
            });
        }
        return x;
    },
    setCooldown: async function (userID, type, date) {
        let x = await profile.findOne({ userID: userID }, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        })

        if (!x) {
            x = await profile.create({
                userID: userID
            });
        }
        
        x.cooldowns[type] = date;
        x.save();
        return;
    }
}