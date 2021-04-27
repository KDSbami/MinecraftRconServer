'use strict';
const express = require('express');
const router = express.Router();
const hour = 60*60*1000;
const hourlyClaim = 20;
const shop = require('../static/shop');
const commandUtil = require('../utils/commands');
const UsersModel = require('../models/users');
const minecraftServer = require('../server');

const isUserOnline = async (user) => {
    const isOnline = await minecraftServer.util.isOnline(user);
    return isOnline
}

const executeCommand = async(command) => { 
    return await minecraftServer.send(command);
}

router.get("/add", async (req, res, next) => {
  
    const payload = req.query;
    const query = { discordID:payload.discordID }
    const userObject = await UsersModel.findUser(query);
    
    if(userObject.status) {
        if(Object.keys(userObject.user).length >= 1) {
            const updatedData = {
                discordID:payload.discordID,
                serverPoints:parseInt(userObject['user'].serverPoints) + parseInt(payload.amount)
            }
            
            const updatedObject = await UsersModel.updateUser(updatedData);
            if(updatedObject.status) {
                if(Object.keys(updatedObject.user).length >= 1) {
                res.status(201).json({
                    status:1,
                    message: "success",
                    user:updatedObject.user
                });
                } else {
                res.status(200).json({
                    status:2,
                    message: "user not found."
                });
                }
            } else {
                res.status(500).json({
                status:0,
                message: "server error"
                });
            }
        } else {
            res.status(200).json({
                status:2,
                message: "user not found."
            });
        }
    } else {
        res.status(500).json({
            status:0,
            message: "server error"
        });
    }
});

router.get("/subtract", async (req, res, next) => {

    const payload = req.query;
    const query = { discordID:payload.discordID }
    const userObject = await UsersModel.findUser(query);

    if(userObject.status) {

        if(Object.keys(userObject.user).length >= 1) {

            if(userObject['user'].serverPoints < payload.amount) {
                res.status(200).json({
                    status:3,
                    message: "not enough credit.",
                    user: userObject.user
                });
            } else {
                const updatedData = {
                    discordID:payload.discordID,
                    serverPoints:userObject['user'].serverPoints - payload.amount
                }
                const updatedObject = await UsersModel.updateUser(updatedData);
                if(updatedObject.status) {
                    if(Object.keys(updatedObject.user).length >= 1) {
                    res.status(201).json({
                        status:1,
                        message: "success",
                        user:updatedObject.user
                    });
                    } else {
                    res.status(204).json({
                        status:2,
                        message: "user not found."
                    });
                    }
                } else {
                    res.status(500).json({
                    status:0,
                    message: "server error"
                    });
                }
            }
        } else {
            res.status(204).json({
                status:2,
                message: "user not found."
            });
        }
    } else {
        res.status(500).json({
            status:0,
            message: "server error"
        });
    }

});

router.get("/buy", async (req, res, next) => {

    const payload = req.query;
    if(minecraftServer.isOnline) {
       
        if(shop['sellingItems'][payload.item] === undefined) {
            res.status(200).json({
                status:3,
                message: "item not found.",
            });
        } else {
            const query = { discordID:payload.discordID }
            const userObject = await UsersModel.findUser(query);
    
            if(userObject.status) {
                if(Object.keys(userObject.user).length >= 1) {
                    if(await isUserOnline(userObject['user'].minecraftUsername)) {
                        if(shop['sellingItems'][payload.item].type === 'material') {
                            if(userObject['user'].serverPoints < (shop['sellingItems'][payload.item].cost*parseInt(payload.count))) {
                                res.status(200).json({
                                    status:3,
                                    message: "Gareeb. find a job or PAYTM SERVER ADMIN.",
                                    user: userObject.user
                                });
                            } else {
                                const updatedData = {
                                    discordID:payload.discordID,
                                    serverPoints:userObject['user'].serverPoints - (shop['sellingItems'][payload.item].cost*parseInt(payload.count))
                                }
                                
                                const command = commandUtil.createMaterialCommand(userObject['user'].minecraftUsername,shop['sellingItems'][payload.item].minecraftName,(payload.count*shop['sellingItems'][payload.item].count)); 
                                const serverResp = await executeCommand(command);
                                if(serverResp.split(' ')[0] !== 'No') {
                                    const updatedObject = await UsersModel.updateUser(updatedData);
                                    if(updatedObject.status) {
                                        if(Object.keys(updatedObject.user).length >= 1) {
                                        res.status(201).json({
                                            status:1,
                                            message: `LOL. YOU JUST WASTED ${shop['sellingItems'][payload.item].cost*parseInt(payload.count)} SP. You now have ${updatedData.serverPoints} SP`,
                                            user:updatedObject.user
                                        });
                                        } else {
                                        res.status(204).json({
                                            status:2,
                                            message: "user not found."
                                        });
                                        }
                                    } else {
                                        res.status(500).json({
                                        status:0,
                                        message: "server error"
                                        });
                                    }
                                    } else {
                                        res.status(200).json({
                                            status:3,
                                            message: "user not found ingame."
                                        });
                                    }
                            }
                        } else if(shop['sellingItems'][payload.item].type === 'skin') {
                            
                            if(userObject['user'].serverPoints < (shop['sellingItems'][payload.item].cost)) {
                                res.status(200).json({
                                    status:3,
                                    message: "GAREEEEEEEEB. not enough credit.",
                                    user: userObject.user
                                });
                            } else {

                                const updatedData = {
                                    discordID:payload.discordID,
                                    serverPoints:userObject['user'].serverPoints - (shop['sellingItems'][payload.item].cost)
                                }
                                
                                const command = commandUtil.createSkinCommand(userObject['user'].minecraftUsername,payload.skinName); 
                                await executeCommand(command);
                                    const updatedObject = await UsersModel.updateUser(updatedData);
                                    if(updatedObject.status) {
                                        if(Object.keys(updatedObject.user).length >= 1) {
                                        res.status(201).json({
                                            status:1,
                                            message: `You just spent ${shop['sellingItems'][payload.item].cost} for a plastic surgery.\n You can get a boobjob but your heart is still the same YOU MONSTER. ` ,
                                            user:updatedObject.user
                                        });
                                        } else {
                                        res.status(204).json({
                                            status:2,
                                            message: "user not found."
                                        });
                                        }
                                    } else {
                                        res.status(500).json({
                                        status:0,
                                        message: "server error"
                                        });
                                    }
                            }
                        } else if(shop['sellingItems'][payload.item].type === 'deathTP'){
                            
                            if(userObject['user'].serverPoints < (shop['sellingItems'][payload.item].cost)) {
                                res.status(200).json({
                                    status:3,
                                    message: "LOOT LOST LOL, YOU DONT HAVE MOOLA FOR THIS SHIT.",
                                    user: userObject.user
                                });
                            } else {

                                const updatedData = {
                                    discordID:payload.discordID,
                                    serverPoints:userObject['user'].serverPoints - (shop['sellingItems'][payload.item].cost)
                                }
                                
                                const lastDeathCommand = await minecraftServer.JSON.get(`players/${userObject['user'].minecraftUsername}`,'lastDeathTP');  
                                if(lastDeathCommand === undefined) {
                                    
                                    res.status(200).json({
                                        status:3,
                                        message: "couldnt update your death location",
                                    });

                                } else {
                                    executeCommand(lastDeathCommand);
                                    const updatedObject = await UsersModel.updateUser(updatedData);
                                    if(updatedObject.status) {
                                        if(Object.keys(updatedObject.user).length >= 1) {
                                        res.status(201).json({
                                            status:1,
                                            message: "JA SIMRAN JA, BACHA LE APNI LOOT.",
                                            user:updatedObject.user
                                        });
                                        } else {
                                        res.status(204).json({
                                            status:2,
                                            message: "user not found."
                                        });
                                        }
                                    } else {
                                        res.status(500).json({
                                        status:0,
                                        message: "server error"
                                        });
                                    }
                            }
                                }
                                

                        }
                    } else {
                        res.status(200).json({
                            status:3,
                            message: "user not online."
                        });
                    }
    
                } else {
                    res.status(204).json({
                        status:2,
                        message: "user not found."
                    });
                }
            } else {
                res.status(500).json({
                    status:0,
                    message: "server error"
                });
            }
            }
    } else {
        res.status(200).json({
            status:3,
            message: "server is offline."
        });
    }
    
});

router.get("/sell", async (req, res, next) => {

    if(minecraftServer.isOnline) {
        const payload = req.query;
        const query = { discordID:payload.discordID }
            const userObject = await UsersModel.findUser(query);

            if(userObject.status) {

                if(Object.keys(userObject.user).length >= 1) {

                    if(await isUserOnline(userObject['user'].minecraftUsername)) {
                        const sellCount = payload.count === undefined?1:payload.count;
                        const command = commandUtil.createSellCommand(userObject['user'].minecraftUsername,shop.buying['serverPointsItem'].minecraftName,sellCount); 
                        const serverResponse = await executeCommand(command);
                        if (serverResponse.split(' ')[0] === 'No') {
                            res.status(200).json({
                                status:3,
                                message: `YOUSA DONT HAVE ITEM: ${shop['buying']['serverPointsItem'].name}.`,
                                user: userObject.user
                            });
                        } else {
                            const count = parseInt(serverResponse.split(' ')[1]);

                            const updatedData = {
                                discordID:payload.discordID,
                                serverPoints:userObject['user'].serverPoints + (count * shop['buying']['serverPointsItem'].cost)
                            }
                            const updatedObject = await UsersModel.updateUser(updatedData);
                            if(updatedObject.status) {
                                if(Object.keys(updatedObject.user).length >= 1) {
                                res.status(200).json({
                                    status:1,
                                    message: `Aight. You sold ${count * shop['buying']['serverPointsItem'].cost} worth of merchendise to the Enterprise. Ypou now have ${updatedData.serverPoints} SP`,
                                    user:updatedObject.user
                                });
                                } else {
                                    await executeCommand(commandUtil.createMaterialCommand(userObject['user'].minecraftUsername,shop['buying']['serverPointsItem'].minecraftName,count));
                                    res.status(200).json({
                                        status:2,
                                        message: "user not found."
                                    });
                                }
                            } else {
                                await executeCommand(commandUtil.createMaterialCommand(userObject['user'].minecraftUsername,shop['buying']['serverPointsItem'].minecraftName,count));
                                res.status(500).json({
                                status:0,
                                message: "server error"
                                });
                            }

                        }

                    } else {
                        res.status(200).json({
                            status:3,
                            message: "user not online.",
                            amount: userObject.user
                        });
                    }

                } else {
                    res.status(204).json({
                        status:2,
                        message: "user not found."
                    });
                }

            } else {
                res.status(500).json({
                    status:0,
                    message: "server error"
                });
            }
        } else {
            res.status(200).json({
                status:3,
                message: "server is offline."
            });
        }
});

router.get("/claim", async (req, res, next) => {
  
    const payload = req.query;
    const query = { discordID:payload.discordID }
    const userObject = await UsersModel.findUser(query);
    
    if(userObject.status) {
        if(Object.keys(userObject.user).length >= 1) {
            const lastCreditTime = new Date(userObject['user'].lastCreditedAt).getTime();
            const timeNow = new Date().getTime();
            if((timeNow - lastCreditTime) > hour) {
                const updatedData = {
                    discordID:payload.discordID,
                    serverPoints:parseInt(userObject['user'].serverPoints) + parseInt(hourlyClaim),
                    lastCreditedAt:new Date()
                }
                
                const updatedObject = await UsersModel.updateUser(updatedData);
                if(updatedObject.status) {
                    if(Object.keys(updatedObject.user).length >= 1) {
                    res.status(201).json({
                        status:1,
                        message: `Congratulations Loser, you have claimed ${hourlyClaim} Points, now you have ${updatedData.serverPoints} Penises \n \n *Points`,
                        user:updatedObject.user
                    });
                    } else {
                    res.status(200).json({
                        status:2,
                        message: "user not found."
                    });
                    }
                } else {
                    res.status(500).json({
                    status:0,
                    message: "server error"
                    });
                }
            } else {
                res.status(200).json({
                    status:3,
                    message: `Abe, ${parseInt(60 - (((new Date().getTime())-lastCreditTime )/(1000*60)))} minute wait kar pehle.`
                });
            }
            
        } else {
            res.status(200).json({
                status:2,
                message: "user not found."
            });
        }
    } else {
        res.status(500).json({
            status:0,
            message: "server error"
        });
    }
});

router.get("/myPoints", async (req, res, next) => {
  
    const payload = req.query;
    const query = { discordID:payload.discordID }
    const userObject = await UsersModel.findUser(query);
    
    if(userObject.status) {
        if(Object.keys(userObject.user).length >= 1) {
                        res.status(200).json({
                            status:1,
                            message: `You have ${userObject.user['serverPoints']} SP. \n\n You can get 2 SP per day. \n You can trade 1 EYE OF ENDER for ${shop.buying['serverPointsItem'].cost} SP with /sell command.`
                        });
            
        } else {
            res.status(200).json({
                status:2,
                message: "user not found."
            });
        }
    } else {
        res.status(500).json({
            status:0,
            message: "server error"
        });
    }
});

module.exports = router;

/*

wrong bot request - 2
success - 1
server error 0
wrong user request - 3

*/  