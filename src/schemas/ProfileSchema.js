const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    userID: String,
    econ: {
        balance: {
            type: Number,
            default: 500
        },
        gems: {
            type: Number,
            default: 0
        },
        payment: {
            payAmount: {
                type: Number,
                default: 0
            },
            lastPay: {
                type: Number,
                default: 0
            }
        }
    },
    inventory: {
        farms: {
            crops: {
                wheat: {
                    type: Number,
                    default: 0
                },
                melon: {
                    type: Number,
                    default: 0
                },
                pumpkin: {
                    type: Number,
                    default: 0
                },
                strawberry: {
                    type: Number,
                    default: 0
                },
                coffee: {
                    type: Number,
                    default: 0
                },
                peach: {
                    type: Number,
                    default: 0
                },
                apple: {
                    type: Number,
                    default: 0
                }
            },
            trees: {
                maple: {
                    type: Number,
                    default: 0
                },
                pine: {
                    type: Number,
                    default: 0
                },
                fir: {
                    type: Number,
                    default: 0
                },
                aspen: {
                    type: Number,
                    default: 0
                },
                oak: {
                    type: Number,
                    default: 0
                },
                birch: {
                    type: Number,
                    default: 0
                }
            }
        },
        items: {
            farmTools: {
                crops: {
                    scarecrow: {
                        type: Number,
                        default: 0
                    },
                    tractor: {
                        type: Number,
                        default: 0
                    }
                },
                trees: {
                    axe: {
                        type: Number,
                        default: 0
                    },
                    bugspray: {
                        type: Number,
                        default: 0
                    }
                }
            }
        }
    },
    uses: {
        tractor: {
            type: Number,
            default: 0
        },
        scarecrow: {
            type: Number,
            default: 0
        },
        axe: {
            type: Number,
            default: 0
        },
        bugspray: {
            type: Number,
            default: 0
        },
    },
    farms: {
        crops: {
            land: {
                type: Number,
                default: 0
            },
            wheat: {
                type: Number,
                default: 0
            },
            melon: {
                type: Number,
                default: 0
            },
            pumpkin: {
                type: Number,
                default: 0
            },
            strawberry: {
                type: Number,
                default: 0
            },
            coffee: {
                type: Number,
                default: 0
            },
            peach: {
                type: Number,
                default: 0
            },
            apple: {
                type: Number,
                default: 0
            },
            fertilized: {
                type: Boolean,
                default: 0
            },
            protected: {
                type: Boolean,
                default: 0
            }
        },
        trees: {
            land: {
                type: Number,
                default: 0
            },
            axed: {
                type: Boolean,
                default: 0
            },
            sprayed: {
                type: Boolean,
                default: 0
            },
            maple: {
                type: Number,
                default: 0
            },
            pine: {
                type: Number,
                default: 0
            },
            fir: {
                type: Number,
                default: 0
            },
            aspen: {
                type: Number,
                default: 0
            },
            oak: {
                type: Number,
                default: 0
            },
            birch: {
                type: Number,
                default: 0
            }
        }
    },
    cooldowns: {
            cropHarvest: {
                type: Date,
                default: 0
            },
            treeHarvest: {
                type: Number,
                default: 0
            }
    },
    boosts: {
        prestige: {
            farmLevel: {
                type: Number,
                default: 0
            },
            farmBoost: {
                type: Number,
                default: 0
            }
        },
        contribute: {
            contributeAmount: {
                type: Number,
                default: 0
            },
            harvestBoost: {
                type: Number,
                default: 0
            }
        }
    },
    collections: {
        raritys: {
            royalGem: {
                type: Number,
                default: 0
            }
        }
    }
});

module.exports = mongoose.model("Profile", profileSchema);