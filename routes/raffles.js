'use strict';
const express = require('express');
const router = express.Router();
const hour = 12*60*60*1000;
const hourlyClaim = 1;
const shop = require('../static/shop');
const commandUtil = require('../utils/commands');
const UsersModel = require('../models/users');
const minecraftServer = require('../server');
const rolls = require('../utils/rolls');
const roller = new rolls();

const createRollHook = (name, description, rarety , img, color) => {

    return {
        "content": null,
        "embeds": [
          {
            "title": name,
            "description": description,
            "color": color,
            "footer": {
              "text": rarety
            },
            "thumbnail": {
              "url": img
            }
          }
        ]
      }
}

const isUserOnline = async (user) => {
    const isOnline = await minecraftServer.util.isOnline(user);
    return isOnline
}

const executeCommand = async(command) => { 
    return await minecraftServer.send(command);
}

router.get("/claim", async (req, res, next) => {
  
    const payload = req.query;
    const query = { discordID:payload.discordID }
    const userObject = await UsersModel.findUser(query);
    
    if(userObject.status) {
        if(Object.keys(userObject.user).length >= 1) {
            const lastRaffledTime = new Date(userObject['user'].lastRaffledAt).getTime();
            const timeNow = new Date().getTime();
            if((timeNow - lastRaffledTime) > hour) {
                const updatedData = {
                    discordID:payload.discordID,
                    RafflesOwned:parseInt(userObject['user'].RafflesOwned) + parseInt(hourlyClaim),
                    lastRaffledAt:new Date()
                }
                
                const updatedObject = await UsersModel.updateUser(updatedData);
                if(updatedObject.status) {
                    if(Object.keys(updatedObject.user).length >= 1) {
                    res.status(201).json({
                        status:1,
                        message: `Congratulations gambling addict, you have claimed ${hourlyClaim} Raffle, now you have ${updatedData.RafflesOwned} Raffles`,
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
                    message: `Oay, ${parseInt(720 - (((new Date().getTime())-lastRaffledTime )/(1000*60)))} minute wait kar pehle.`
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

router.get("/gamble", async (req, res, next) => {

    const payload = req.query;
    if(minecraftServer.isOnline) {
       
            const query = { discordID:payload.discordID }
            const userObject = await UsersModel.findUser(query);
    
            if(userObject.status) {
                if(Object.keys(userObject.user).length >= 1) {

                    if(await isUserOnline(userObject['user'].minecraftUsername)) {
                            if(userObject['user'].RafflesOwned < 1 ) {
                                res.status(200).json({
                                    status:3,
                                    message: "Raffles fin. Paypal the server admin pls, thanks :)",
                                    user: userObject.user
                                });
                            } else {
                                const updatedData = {
                                    discordID:payload.discordID,
                                    RafflesOwned:userObject['user'].RafflesOwned - 1
                                }
                                const item = roller.roll;
                                const command = commandUtil.createMaterialCommand(userObject['user'].minecraftUsername,item.minecraftName,item.count); 
                                const serverResp = await executeCommand(command);
                                const webHook = createRollHook(item.name, item.description, roller.rarety((item.weight/roller.totalWeight)*100) , item.img, roller.color[roller.rarety((item.weight/roller.totalWeight)*100)])
                                if(serverResp.split(' ')[0] !== 'No') {
                                    const updatedObject = await UsersModel.updateUser(updatedData);
                                    if(updatedObject.status) {
                                        if(Object.keys(updatedObject.user).length >= 1) {
                                        res.status(201).json({
                                            status:1,
                                            message: `YOU JUST WON ${item.count} ${item.name} at a chance of ${(item.weight/roller.totalWeight)*100}% `,
                                            user:updatedObject.user,
                                            hook:webHook
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
    } else {
        res.status(200).json({
            status:3,
            message: "server is offline."
        });
    }
    
});

router.get("/buyRaffle", async (req, res, next) => {

    if(minecraftServer.isOnline) {
        const payload = req.query;

        const query = { discordID:payload.discordID }
            const userObject = await UsersModel.findUser(query);

            if(userObject.status) {

                if(Object.keys(userObject.user).length >= 1) {
                    console.log(shop['buying']['rafflesItem'].minecraftName)
                    if(await isUserOnline(userObject['user'].minecraftUsername)) {
                        const sellCount = payload.count === undefined?1:payload.count;
                        console.log(sellCount)
                        const command= commandUtil.createSellCommand(userObject['user'].minecraftUsername,shop['buying']['rafflesItem'].minecraftName,sellCount); 
                        const serverResponse = await executeCommand(command);
                        if (serverResponse.split(' ')[0] === 'No') {
                            res.status(200).json({
                                status:3,
                                message: `user doesnt have item: ${shop['buying']['rafflesItem'].name}.`,
                                user: userObject.user
                            });
                        } else {
                            const count = parseInt(serverResponse.split(' ')[1]);
                            console.log(count)
                            const updatedData = {
                                discordID:payload.discordID,
                                RafflesOwned:userObject['user'].RafflesOwned + (count * shop['buying']['rafflesItem'].cost)
                            }
                            const updatedObject = await UsersModel.updateUser(updatedData);
                            if(updatedObject.status) {
                                if(Object.keys(updatedObject.user).length >= 1) {
                                res.status(200).json({
                                    status:1,
                                    message: "success",
                                    user:updatedObject.user
                                });
                                } else {
                                    await executeCommand(commandUtil.createMaterialCommand(userObject['user'].minecraftUsername,shop['buying']['rafflesItem'].minecraftName,count));
                                    res.status(200).json({
                                        status:2,
                                        message: "user not found."
                                    });
                                }
                            } else {
                                await executeCommand(commandUtil.createMaterialCommand(userObject['user'].minecraftUsername,shop['buying']['rafflesItem'].minecraftName,count));
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

router.get("/myRaffles", async (req, res, next) => {
  
    const payload = req.query;
    const query = { discordID:payload.discordID }
    const userObject = await UsersModel.findUser(query);
    
    if(userObject.status) {
        if(Object.keys(userObject.user).length >= 1) {
                        res.status(200).json({
                            status:1,
                            message: `You have ${userObject.user['RafflesOwned']} RP. \n\n You can get 2 RP per day. \n You can trade 1 diamond with /buyRaffle command.`
                        });
            
        } else {
            res.status(200).json({
                status:2,
                message: "Please connect and create an account first."
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