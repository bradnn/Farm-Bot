const profile = require("../../../schemas/ProfileSchema");

module.exports = {
    treeGetFarm: async function (userID) {
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
    treeGetCrops: async function (userID) {
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
    treeDelPlants: async function (userID, type, amount) {
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
    treeAddTrees: async function (userID, trees) {
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
        if(trees.maple) { // If provided obj has maple
            x.inventory.farms.trees.maple = x.inventory.farms.trees.maple + trees.maple;
        }
        if(trees.pine) { // If provided obj has pine
            x.inventory.farms.trees.pine = x.inventory.farms.trees.pine + trees.pine;
        }
        if(trees.fir) { // If provided obj has fir
            x.inventory.farms.trees.fir = x.inventory.farms.trees.fir + trees.fir;
        }
        if(trees.aspen) { // If provided obj has aspen
            x.inventory.farms.trees.aspen = x.inventory.farms.trees.aspen + trees.aspen;
        }
        if(trees.oak) { // If provided obj has oak
            x.inventory.farms.trees.oak = x.inventory.farms.trees.oak + trees.oak;
        }
        if(trees.birch) { // If provided obj has birch
            x.inventory.farms.trees.birch = x.inventory.farms.trees.birch + trees.birch;
        }
        x.save(); // Save to database
        return trees.maple + trees.pine + trees.fir + trees.aspen + trees.oak + trees.birch; // Returns all items added together
    },
    treePlant: async function (userID, tree, amount) {
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
        x.inventory.farms.trees[tree] = x.inventory.farms.trees[tree] - amount; // Removes trees from inventory
        x.farms.trees[tree] = x.farms.trees[tree] + amount; // Adds amount to planted crops
        x.save(); // Save to database
        return x.farms.trees[tree]; // Returns new amount
    },
    treePlantAll: async function (userID) {
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
        var treePrices = require("../../../handlers/treeFarm/Shop/Prices/farmPrices"); // Gets obj of items
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
    treeSellAll: async function (userID) {
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
        var treePrices = require("../../../handlers/cropFarm/Shop/Prices/farmPrices"); // Gets obj of items
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
    treeHarvest: async function (userID) {
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
        var treePrices = require("../../../handlers/treeFarm/Shop/Prices/farmPrices"); // Gets obj of items
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
    treeAddSawUse: async function (userID) {
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
            x.inventory.items.farmTools.trees.chainsaw = x.inventory.items.farmTools.trees.chainsaw - 1; // Remove tractor from inventory
            x.uses.chainsaw = 0; // Resets tractor uses
            x.save(); // Save to database
            return "broke"; // Returns broke
        } else {
            x.uses.chainsaw = x.uses.chainsaw + 1; // Adds tractor use
            x.save(); // Save to database
        }
        return;
    },
    treeGetSaws: async function (userID) {
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
        return x.inventory.items.farmTools.trees.chainsaw;
    },
    treeAddSawed: async function (userID) {
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
        if(x.farm.trees.sawed == false) { // if the farm isnt sawed
            x.farm.trees.sawed = true; // saw trees
        }
        x.save(); // Save to database
        return x;
    },
    treeDelSawed: async function (userID) {
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
        if(x.farm.trees.sawed == true) { // if the farm is sawed
            x.farm.trees.sawed = false; // unsaw? farm
        }
        x.save(); // Save to database
        return x;
    },
    treeGetSawed: async function (userID) {
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
        if(x.farms.trees.sawed == true) {
            return true;
        } else {
            return false;
        }
    },
    treeAddSprayed: async function (userID) {
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
        if(x.farm.trees.sprayed == false) { // if the farm isnt sprayed
            x.farm.trees.sprayed = true; // spray farm
        }
        x.save();
        return x;
    },
    treeDelSprayed: async function (userID) {
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
        if(x.farm.trees.sprayed == true) { // if the farm is sprayed
            x.farm.trees.sprayed = false; // unspray farm
        }
        x.save();
        return x;
    },
    treeGetSprayed: async function (userID) {
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
    treeAddSprayUse: async function (userID) {
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
    treeGetSpray: async function (userID) {
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
    treeGetFarmCount: async function (userID) {
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
        var treePrices = require("../../../handlers/treeFarm/Shop/Prices/farmPrices"); // Gets prices from obj
        var treeItems = Object.keys(treePrices.prices); // Gets item names only
        var itemPrices = { ...treeItems}; // Does nothing but like
        var amount = 0; 

        for(tree in itemPrices) {
            amount = amount + x.farms.trees[itemPrices[tree]]; // Adds to amount for every planted crop
        }
        return amount;
    },
    treeGetInvenCount: async function (userID) {
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
        var treePrices = require("../../../handlers/treeFarm/Shop/Prices/farmPrices"); // Gets prices from obj
        var treeItems = Object.keys(treePrices.prices); // Gets item names only
        var itemPrices = { ...treeItems}; // Does nothing but like
        var amount = 0;

        for(tree in itemPrices) {
            amount = amount + x.inventory.farms.trees[itemPrices[tree]]; // Adds to amount for every plant in inventory
        }
        return amount;
    }
}