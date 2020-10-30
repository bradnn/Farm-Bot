const { getProfile, setCooldown } = require("../../utils/user/user");
const { msToTime } = require("../../utils/format/timeUtils");

const cooldowns = {
    cropHarvest: 120000,
    treeHarvest: 120000
}

const generateCooldownEmbed = (username, type, remaining) => {
    const embed = {
        embed: {
            author: {
                name: `Calm down ${username}.`
            },
            description: `Give it some time before you ${type} again! Remaining: ${remaining}`,
            color: 16664648
        }
    }

    return embed;
}

const getCooldown = async (type, user) => {
    let userProfile = await getProfile(user.id);
    let userCooldowns = userProfile.cooldowns;
    var cooldown;

    if(type == "cropHarvest") {
        if(userProfile.farms.crops.fertilized == true) {
            cooldown = cooldowns[type] / 2
        } else {
            cooldown = cooldowns[type]
        }
    } else if (type == "treeHarvest") {
        if(userProfile.farms.trees.axed == true) {
            cooldown = cooldowns[type] / 2
        } else {
            cooldown = cooldowns[type]
        }
    } else {
        cooldown = cooldowns[type]
    }

    const previousTime = userCooldowns[type];
    const nowTime = new Date();
    const timePassed = Math.abs(previousTime - nowTime);

    const timeLeftMs = Math.ceil((cooldown - timePassed));
    if(timeLeftMs < 0) {
        return 0;
    } else {
        return timeLeftMs;
    }
}

const onCooldown = async (type, user) => {
    if(!type) {
        return {
            response: false
        };
    }
    if(!user) {
        console.error("Missing Arguments (ON_COOLDOWN)");
        return null;
    }
    let userProfile = await getProfile(user.id);
    let userCooldowns = userProfile.cooldowns;
    var cooldown;

    if(type == "cropHarvest") {
        if(userProfile.farms.crops.fertilized == true) {
            cooldown = cooldowns[type] / 2
        } else {
            cooldown = cooldowns[type]
        }
    } else if (type == "treeHarvest") {
        if(userProfile.farms.trees.axed == true) {
            cooldown = cooldowns[type] / 2
        } else {
            cooldown = cooldowns[type]
        }
    } else {
        cooldown = cooldowns[type]
    }

    const previousTime = userCooldowns[type];
    const nowTime = new Date();
    const timePassed = Math.abs(previousTime - nowTime);

    if (timePassed < cooldown) {

        const timeLeftMs = Math.ceil((cooldown - timePassed));
        const timeLeftSec = (timeLeftMs / 1000);
        const timeLeftFormatted = msToTime(timeLeftMs);

        return {
            response: true,
            timeLeftSec,
            timeLeftMs,
            timeLeftFormatted,
            message: `${type} is on cooldown! ${timeLeftFormatted} remaining until you can perform ${type}`,
            embed: generateCooldownEmbed(user.username, type, timeLeftFormatted)
        };
    }
    await setCooldown(user.id, type, nowTime);
    return {
        response: false
    };
}

module.exports = { onCooldown, getCooldown };