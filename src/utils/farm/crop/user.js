const profile = require("../../../schemas/ProfileSchema");

module.exports = {
    cropGetFarm: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        });

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        };
        return x.farms.crops; // Returns planted crops
    },
    cropGetCrops: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) {
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        return x.inventory.crops; // Returns inventory crops
    },
    cropDelPlants: async function (userID, type, amount) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        x.farms.crops[type] = x.farms.crops[type] - amount; // Deletes amount from their crops
        if(x.farms.crops[type] < 0) { // If plants is under 0
            x.farms.crops[type] = 0; // Set plants to 0 to prevent negatives
        }
        x.save(); // Save to database

        return x.farms.crops; // Returns farm crops
    },
    cropAddCrops: async function (userID, crops) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(crops.wheat) { // If provided obj has wheat
            x.inventory.crops.wheat = x.inventory.crops.wheat + crops.wheat;
        }
        if(crops.melon) { // If provided obj has melon
            x.inventory.crops.melon = x.inventory.crops.melon + crops.melon;
        }
        if(crops.pumpkin) { // If provided obj has pumpkin
            x.inventory.crops.pumpkin = x.inventory.crops.pumpkin + crops.pumpkin;
        }
        if(crops.strawberry) { // If provided obj has strawberry
            x.inventory.crops.strawberry = x.inventory.crops.strawberry + crops.strawberry;
        }
        if(crops.coffee) { // If provided obj has coffee
            x.inventory.crops.coffee = x.inventory.crops.coffee + crops.coffee;
        }
        if(crops.peach) { // If provided obj has peach
            x.inventory.crops.peach = x.inventory.crops.peach + crops.peach;
        }
        if(crops.apple) { // If provided obj has apple
            x.inventory.crops.apple = x.inventory.crops.apple + crops.apple;
        }
        x.save(); // Save to database
        return crops.wheat + crops.melon + crops.pumpkin + crops.strawberry + crops.coffee + crops.peach + crops.apple; // Returns all items added together
    },
    cropPlant: async function (userID, crop, amount) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })
        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        x.inventory.crops[crop] = x.inventory.crops[crop] - amount; // Removes crops from inventory
        x.farm.crops[crop] = x.farm.crops[crop] + amount; // Adds amount to planted crops
        x.save(); // Save to database
        return x.farm.crops[crop]; // Returns new amount
    },
    cropPlantAll: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        var cropPrices = require("../Games/Crop/Shop/Prices/farmPrices"); // Gets obj of items
        var cropItems = Object.keys(cropPrices.prices); // Returns only item names in array
        var itemPrices = { ...cropItems}; // Useless but like still here
        var plantedCount = 0; 
        for(crop in itemPrices) {
            plantedCount = plantedCount + x.inventory.crops[itemPrices[crop]]; // Adds to amount planted
            x.farms.crops[itemPrices[crop]] = x.inventory.crops[itemPrices[crop]]; // Adds to planted crops
            x.inventory.crops[itemPrices[crop]] = 0; // Clears crop inventory
        }
        x.save(); // Save to database
        return;
    },
    cropSellAll: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        var cropPrices = require("../Games/Crop/Shop/Prices/farmPrices"); // Gets obj of items
        var cropItems = Object.keys(cropPrices.prices); // Returns only item names in array
        var itemPrices = { ...cropItems}; // Useless but like still here
        var moneyToAdd = 0;
        for(crop in itemPrices) {
            moneyToAdd = moneyToAdd + cropPrices.prices[itemPrices[crop]] * x.inventory.crops[itemPrices[crop]]; // Multiplies price by amount in inventory
            x.inventory.crops[itemPrices[crop]] = 0; // Clears inventory crop;
        }
        x.econ.balance = x.econ.balance + moneyToAdd; // Adds money to balance
        x.save(); // Save to database
        return;
    },
    cropAddFertilize: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.farm.crops.fertilized == false) { // if the farm isnt fertilized
            x.farm.crops.fertilized = true; // fertilize farm
        }
        x.save(); // Save to database
        return x;
    },
    cropDelFertilize: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.farm.crops.fertilized == true) { // if the farm is fertilized
            x.farm.crops.fertilized = false; // unfertilize farm
        }
        x.save(); // Save to database
        return x;
    },
    cropAddProtected: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.farm.crops.protected == false) { // if the farm isnt protected
            x.farm.crops.protected = true; // protect farm
        }
        x.save();
        return x;
    },
    cropDelProtected: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.farm.crops.protected == true) { // if the farm is protected
            x.farm.crops.protected = false; // unprotect farm
        }
        x.save();
        return x;
    },
    cropAddTractorUse: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.uses.tractor >= 5) {
            x.inventory.items.tractor = x.inventory.items.tractor - 1; // Remove tractor from inventory
            x.uses.tractor = 0; // Resets tractor uses
            x.save(); // Save to database
            return "broke"; // Returns broke
        } else {
            x.uses.tractor = x.uses.tractor + 1; // Adds tractor use
            x.save(); // Save to database
        }
        return;
    },
    cropAddScarecrowUser: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.uses.scarecrow >= 5) {
            x.inventory.items.scarecrow = x.inventory.items.scarecrow - 1; // Removes 1 scarecrow from inventory
            x.uses.scarecrow = 0; // Resets uses
            x.save(); // Save to database
            return "broke"; // Returns broke
        } else {
            x.uses.scarecrow = x.uses.scarecrow + 1; // Adds scarecrow use
            x.save(); // Save to database
        }
        return;
    },
    cropGetFarmCount: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        var cropPrices = require("../Games/Crop/Shop/Prices/farmPrices"); // Gets prices from obj
        var cropItems = Object.keys(cropPrices.prices); // Gets item names only
        var itemPrices = { ...cropItems}; // Does nothing but like
        var amount = 0; 

        for(crop in itemPrices) {
            amount = amount + x.farms.crops[itemPrices[crop]]; // Adds to amount for every planted crop
        }
        return amount;
    },
    cropGetInvenCount: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        var cropPrices = require("../Games/Crop/Shop/Prices/farmPrices"); // Gets prices from obj
        var cropItems = Object.keys(cropPrices.prices); // Gets item names only
        var itemPrices = { ...cropItems}; // Does nothing but like
        var amount = 0;

        for(crop in itemPrices) {
            amount = amount + x.inventory.crops[itemPrices[crop]]; // Adds to amount for every plant in inventory
        }
        return amount;
    }
}