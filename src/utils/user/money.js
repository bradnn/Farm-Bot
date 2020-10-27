const profile = require("../../schemas/ProfileSchema");

const delMoney = async (userID, amount) => {
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
    x.econ.balance = x.econ.balance - amount;
    x.save();
    return x.econ.balance;
}

const addMoney = async (userID, amount) => {
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
    x.econ.balance = x.econ.balance + amount;
    x.save();
    return x.econ.balance;
}

const getMoney = async (userID) => {
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
    return x.econ.balance;
}

const setLastPay = async (userID, ms) => {
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
    x.econ.payment.lastPay = ms;
    x.econ.payment.payAmount = 0;
    x.save();
    return x.econ.payment.lastPay;
}

const setPayAmount = async (userID, amount) => {
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
    x.econ.payment.payAmount = amount;
    x.save();
    return x.econ.payment.payAmount;
}

module.exports = { delMoney, addMoney, setLastPay, getMoney, setPayAmount };