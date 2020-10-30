const profile = require("../../schemas/ProfileSchema")

module.exports.TreeUtils = {
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
        return x.farms.trees; // Returns planted trees
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
        return x.inventory.farms.trees; // Returns inventory trees
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
        x.farms.trees[type] = x.farms.trees[type] - amount; // Deletes amount from their trees
        if(x.farms.trees[type] < 0) { // If plants is under 0
            x.farms.trees[type] = 0; // Set plants to 0 to prevent negatives
        }
        x.save(); // Save to database

        return x.farms.trees; // Returns trees crops
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
        console.log(keys);

        for(type in keys) {
            x.inventory.farms.trees[keys[type]] += obj[keys[type]];
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
        x.inventory.farms.trees[type] = x.inventory.farms.trees[type] - amount; // Removes trees from inventory
        x.farms.trees[type] = x.farms.trees[type] + amount; // Adds amount to planted crops
        x.save(); // Save to database
        return x.farms.trees[type]; // Returns new amount
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
        var treePrices = require("./Shop/Prices/farmPrices"); // Gets obj of items
        var treeItems = Object.keys(treePrices.prices); // Returns only item names in array
        var itemPrices = { ...treeItems}; // Useless but like still here
        var plantedCount = 0; 
        for(tree in itemPrices) {
            plantedCount = plantedCount + x.inventory.farms.trees[itemPrices[tree]]; // Adds to amount planted
            x.farms.trees[itemPrices[tree]] = x.farms.trees[itemPrices[tree]] + x.inventory.farms.trees[itemPrices[tree]]; // Adds to planted crops
            x.inventory.farms.trees[itemPrices[tree]] = 0; // Clears crop inventory
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
        var treePrices = require("./Shop/Prices/farmPrices"); // Gets obj of items
        var treeItems = Object.keys(treePrices.prices); // Returns only item names in array
        var itemPrices = { ...treeItems}; // Useless but like still here
        var moneyToAdd = 0;
        for(tree in itemPrices) {
            moneyToAdd = moneyToAdd + cropPrices.prices[itemPrices[tree]] * x.inventory.farms.trees[itemPrices[tree]]; // Multiplies price by amount in inventory
            x.inventory.farms.trees[itemPrices[tree]] = 0; // Clears inventory crop;
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
        var treePrices = require("./Shop/Prices/farmPrices"); // Gets obj of items
        var treeItems = Object.keys(treePrices.prices); // Returns only item names in array
        var itemPrices = { ...treeItems}; // Useless but like still here
        var harvestCount = 0; 
        for(tree in itemPrices) {
            var amount = Math.floor(Math.ceil(x.farms.trees[itemPrices[tree]] * 0.25));
            harvestCount = harvestCount + amount; // Adds to amount planted
            x.inventory.farms.trees[itemPrices[tree]] = x.inventory.farms.trees[itemPrices[tree]] + amount; // Adds to inventory crops
        }
        x.save(); // Save to database
        return harvestCount;
    },
    addAxeUse: async function (userID) {
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
            x.inventory.items.farmTools.trees.axe = x.inventory.items.farmTools.trees.axe - 1; // Remove tractor from inventory
            x.uses.axe = 0; // Resets tractor uses
            x.save(); // Save to database
            return "broke"; // Returns broke
        } else {
            x.uses.axe = x.uses.axe + 1; // Adds tractor use
            x.save(); // Save to database
        }
        return;
    },
    getAxes: async function (userID) {
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
        return x.inventory.items.farmTools.trees.axe;
    },
    addAxed: async function (userID) {
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
        if(x.farms.trees.axed == false) { // if the farm isnt axed
            x.farms.trees.axed = true; // saw axed
        }
        x.save(); // Save to database
        return x;
    },
    delAxed: async function (userID) {
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
        if(x.farms.trees.axed == true) { // if the farm is axed
            x.farms.trees.axed = false; // unaxe? farm
        }
        x.save(); // Save to database
        return x;
    },
    getAxed: async function (userID) {
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
        if(x.farms.trees.axed == true) {
            return true;
        } else {
            return false;
        }
    },
    getSprays: async function (userID) {
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
        return x.inventory.items.farmTools.trees.bugspray;
    },
    addSprayed: async function (userID) {
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
        if(x.farms.trees.sprayed == false) { // if the farm isnt sprayed
            x.farms.trees.sprayed = true; // spray farm
        }
        x.save();
        return x;
    },
    delSprayed: async function (userID) {
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
        if(x.farms.trees.sprayed == true) { // if the farm is sprayed
            x.farms.trees.sprayed = false; // unspray farm
        }
        x.save();
        return x;
    },
    getSprayed: async function (userID) {
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
        if(x.farms.trees.sprayed == true) {
            return true;
        } else {
            return false;
        }
    },
    addSprayUse: async function (userID) {
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
            x.inventory.items.farmTools.trees.sprayed = x.inventory.items.farmTools.trees.sprayed - 1; // Removes 1 scarecrow from inventory
            x.uses.bugspray = 0; // Resets uses
            x.save(); // Save to database
            return "broke"; // Returns broke
        } else {
            x.uses.bugspray = x.uses.bugspray + 1; // Adds scarecrow use
            x.save(); // Save to database
        }
        return;
    },
    getSprayed: async function (userID) {
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
        return x.inventory.items.farmTools.trees.sprayed;
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
        var treePrices = require("./Shop/Prices/farmPrices"); // Gets prices from obj
        var treeItems = Object.keys(treePrices.prices); // Gets item names only
        var itemPrices = { ...treeItems}; // Does nothing but like
        var amount = 0; 

        for(tree in itemPrices) {
            amount = amount + x.farms.trees[itemPrices[tree]]; // Adds to amount for every planted crop
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
        var treePrices = require("./Shop/Prices/farmPrices"); // Gets prices from obj
        var treeItems = Object.keys(treePrices.prices); // Gets item names only
        var itemPrices = { ...treeItems}; // Does nothing but like
        var amount = 0;

        for(tree in itemPrices) {
            amount = amount + x.inventory.farms.trees[itemPrices[tree]]; // Adds to amount for every plant in inventory
        }
        return amount;
    }
}