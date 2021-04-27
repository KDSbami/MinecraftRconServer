'use strict';
const express = require('express');
const router = express.Router();
const UsersModel = require('../models/users');
const minecraftServer = require('../server')

router.get("/add", async (req, res, next) => {
  
  const payload = req.query;
  
  const userData = {
    discordID:payload.discordID,
    minecraftUsername:payload.minecraftUsername
  }
  
  if(minecraftServer.isOnline) {
  
    const userObject = await UsersModel.addUser(userData);
    if(!userObject.status) {
      if(Object.keys(userObject.user).length < 1) {
        
        res.status(500).json({
          status:0,
          message: "server error"
        });
      } else {
        res.status(200).json({
          status:2,
          message: "user exists"
        });
      }
    } else {
      const serverMessage = await minecraftServer.send(`whitelist add ${userObject['user'].minecraftUsername}`)
      res.status(201).json({
        status:1,
        message: "success",
        user:userObject.user
      });
    }
  } else {
    res.status(200).json({
      status:3,
      message: "server is offline."
  });
  }
});

router.get("/update", async (req, res, next) => {

  const payload = req.query;

  const userData = {
    discordID:payload.discordID,
    minecraftUsername:payload.minecraftUsername
  }
  const userObject = await UsersModel.updateUser(userData);
  if(userObject.status) {
    if(userObject.user) {
      const serverMessage = await minecraftServer.send(`whitelist add ${userObject['user'].minecraftUsername}`)
      res.status(201).json({
        status:1,
        message: "success",
        user:userObject.user
      });
    } else {
      res.status(200).json({
        status:2,
        message: "user not found."
      });
    }
  } else if(userObject.user) {
    
    res.status(200).json({
      status:2,
      message: "user already exists."
    });    

  } else {
    res.status(500).json({
      status:0,
      message: "server error"
    });
  }

});

module.exports = router;

/*

wrong request - 2
success - 1
server error 0

*/