const profile = require("../../schemas/ProfileSchema")

module.exports.CropUtils = {
    getPrices: function (type) {
        if(!type) return require('./Shop/Prices/farmPrices');
        if(type == "crops" || type == "crop") return require('./Shop/Prices/farmPrices');
        else if(type == "items" || type == "item") return require('./Shop/Prices/toolPrices');
        else return require('./Shop/Prices/farmPrices');
    },
    getFarm: async function (userID) {
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
    getCrops: async function (userID) {
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
        return x.inventory.farms.crops; // Returns inventory crops
    },
    delPlants: async function (userID) {
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

        return x.farms.crops; // Returns crops crops
    },
    addInventory: async function (userID, obj) {
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

        var keys = Object.keys(obj);
        var added = 0;

        for(type in keys) {
            x.inventory.farms.crops[keys[type]] += obj[keys[type]];
            added += obj[keys[type]];
        }
        x.save(); // Save to database
        return added; // Returns all items added together
    },
    plant: async function (userID, type, amount) {
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
        x.inventory.farms.crops[type] = x.inventory.farms.crops[type] - amount; // Removes crops from inventory
        x.farms.crops[type] = x.farms.crops[type] + amount; // Adds amount to planted crops
        x.save(); // Save to database
        return x.farms.crops[type]; // Returns new amount
    },
    plantAll: async function (userID) {
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
        var cropPrices = require("./Shop/Prices/farmPrices"); // Gets obj of items
        var cropItems = Object.keys(cropPrices.prices); // Returns only item names in array
        var itemPrices = { ...cropItems}; // Useless but like still here
        var plantedCount = 0; 
        for(crop in itemPrices) {
            plantedCount = plantedCount + x.inventory.farms.crops[itemPrices[crop]]; // Adds to amount planted
            x.farms.crops[itemPrices[crop]] = x.farms.crops[itemPrices[crop]] + x.inventory.farms.crops[itemPrices[crop]]; // Adds to planted crops
            x.inventory.farms.crops[itemPrices[crop]] = 0; // Clears crop inventory
        }
        x.save(); // Save to database
        return plantedCount;
    },
    sellAll: async function (userID) {
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
        var cropPrices = require("./Shop/Prices/farmPrices"); // Gets obj of items
        var cropItems = Object.keys(cropPrices.prices); // Returns only item names in array
        var itemPrices = { ...cropItems}; // Useless but like still here
        var moneyToAdd = 0;
        for(crop in itemPrices) {
            moneyToAdd = moneyToAdd + cropPrices.prices[itemPrices[crop]] * x.inventory.farms.crops[itemPrices[crop]]; // Multiplies price by amount in inventory
            x.inventory.farms.crops[itemPrices[crop]] = 0; // Clears inventory crop;
        }
        x.econ.balance = x.econ.balance + moneyToAdd; // Adds money to balance
        x.save(); // Save to database
        return;
    },
    harvest: async function (userID) {
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
        var cropPrices = require("./Shop/Prices/farmPrices"); // Gets obj of items
        var cropItems = Object.keys(cropPrices.prices); // Returns only item names in array
        var itemPrices = { ...cropItems}; // Useless but like still here
        var harvestCount = 0; 
        for(crop in itemPrices) {
            var amount = Math.floor(Math.ceil(x.farms.crops[itemPrices[crop]] * 0.25));
            harvestCount = harvestCount + amount; // Adds to amount planted
            x.inventory.farms.crops[itemPrices[crop]] = x.inventory.farms.crops[itemPrices[crop]] + amount; // Adds to inventory crops
        }
        x.save(); // Save to database
        return harvestCount;
    },
    addTractorUse: async function (userID) {
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
        if(x.uses.axe >= 5) {
            x.inventory.items.farmTools.crops.tractor = x.inventory.items.farmTools.crops.tractor - 1; // Remove tractor from inventory
            x.uses.tractor = 0; // Resets tractor uses
            x.save(); // Save to database
            return "broke"; // Returns broke
        } else {
            x.uses.tractor = x.uses.tractor + 1; // Adds tractor use
            x.save(); // Save to database
        }
        return;
    },
    getTractors: async function (userID) {
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
        return x.inventory.items.farmTools.crops.tractor;
    },
    addFertilized: async function (userID) {
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
        if(x.farms.crops.fertilized == false) { // if the farm isnt axed
            x.farms.crops.fertilized = true; // saw axed
        }
        x.save(); // Save to database
        return x;
    },
    delFertilized: async function (userID) {
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
        if(x.farms.crops.fertilized == true) { // if the farm is axed
            x.farms.crops.fertilized = false; // unaxe? farm
        }
        x.save(); // Save to database
        return x;
    },
    getFertilized: async function (userID) {
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
        if(x.farms.crops.fertilized == true) {
            return true;
        } else {
            return false;
        }
    },
    getScarecrows: async function (userID) {
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
        return x.inventory.items.farmTools.crops.scarecrow;
    },
    addProtected: async function (userID) {
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
        if(x.farms.crops.protected == false) { // if the farm isnt sprayed
            x.farms.crops.protected = true; // spray farm
        }
        x.save();
        return x;
    },
    delProtected: async function (userID) {
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
        if(x.farms.crops.protected == true) { // if the farm is sprayed
            x.farms.crops.protected = false; // unspray farm
        }
        x.save();
        return x;
    },
    getProtected: async function (userID) {
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
        if(x.farms.crops.protected == true) {
            return true;
        } else {
            return false;
        }
    },
    addScarecrowUse: async function (userID) {
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
            x.inventory.items.farmTools.crops.scarecrow = x.inventory.items.farmTools.crops.scarecrow - 1; // Removes 1 scarecrow from inventory
            x.uses.scarecrow = 0; // Resets uses
            x.save(); // Save to database
            return "broke"; // Returns broke
        } else {
            x.uses.scarecrow = x.uses.scarecrow + 1; // Adds scarecrow use
            x.save(); // Save to database
        }
        return;
    },
    getProtected: async function (userID) {
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
        return x.inventory.items.farmTools.crops.protected;
    },
    getFarmCount: async function (userID) {
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
        var cropPrices = require("./Shop/Prices/farmPrices"); // Gets prices from obj
        var cropItems = Object.keys(cropPrices.prices); // Gets item names only
        var itemPrices = { ...cropItems}; // Does nothing but like
        var amount = 0; 

        for(crop in itemPrices) {
            amount = amount + x.farms.crops[itemPrices[crop]]; // Adds to amount for every planted crop
        }
        return amount;
    },
    getInvenCount: async function (userID) {
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
        var cropPrices = require("./Shop/Prices/farmPrices"); // Gets prices from obj
        var cropItems = Object.keys(cropPrices.prices); // Gets item names only
        var itemPrices = { ...cropItems}; // Does nothing but like
        var amount = 0;

        for(crop in itemPrices) {
            amount = amount + x.inventory.farms.crops[itemPrices[crop]]; // Adds to amount for every plant in inventory
        }
        return amount;
    }
}