'use strict';
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const minecraftServer = require('../server');
const achievement = require('../static/achievements');
const UsersModel = require('../models/users');

const executeCommand = async(command) => { 
  return await minecraftServer.send(command);
}

router.get('/', (req, res) => res.status(200).json({
	message: 'Healthy2',
}));

router.get('/start', (req, res) => {

        try {
          minecraftServer.start();
          res.status(200).json({message: 'You turn me on.' });
        }
        catch(err){
          res.status(404).json({message: 'server couldnt be started' });
          fetch('http://192.168.1.12:4000/postMessage?channelId=minecraft-logs&message=AIYOOOOO! either the server is running ya kuch galat ho raha hai.',(resp) => {
            console.log(resp);
          })
        }
    
});

router.get('/stop', (req, res) => {
  try {
    minecraftServer.stop();
    minecraftServer.isOnline = false;
    fetch('http://192.168.1.12:4000/postMessage?channelId=minecraft-logs&message=Server state : Exit.',(resp) => {
    console.log(resp);
  })
  }
  catch(err){
    console.log(err)
    res.status(404).json({message: 'server couldnt be stopped' });
  }
});



// event handlers

minecraftServer.on('start', event => {
  console.log("sdsds",event)
  minecraftServer.isOnline = true;
  fetch('http://192.168.1.12:4000/postMessage?channelId=minecraft-logs&message=Server has been started.',(resp) => {
    console.log(resp);
  })
})

minecraftServer.on('stop', event => {
  console.log("sdsds",event)
  minecraftServer.isOnline = true;
  fetch('http://192.168.1.12:4000/postMessage?channelId=minecraft-logs&message=Server has been stopped.',(resp) => {
    console.log(resp);
  })
})

minecraftServer.on('death', async event => {
  const reply = await executeCommand(`data get entity ${event.player} Pos`);
  const data = reply.split(' ');
  const x = (data[data.length-3].slice(1)).slice(0,-2);
  const y = data[data.length-2].slice(0,-2);
  const z = data[data.length-1].slice(0,-2);
  await minecraftServer.JSON.set(`players/${event.player}`,'lastDeathTP',`tp ${event.player} ${x} ${y} ${z}`);
})

minecraftServer.on('achievement',async event => {
  
  const query = { minecraftUsername:event.player };
  const userObject = await UsersModel.findUserWithMinecraftUsername(query);
  let userGetsPoints = 0;
  if(event.achievement in achievement) {
    userGetsPoints = achievement[event.achievement];
    executeCommand(`say "${event.player} just got ${achievement[event.achievement]} points for wasting their time by doing ${event.achievement}."`)
  } else {
    userGetsPoints = achievement[event.level];
    executeCommand(`say "${event.player} just got ${achievement[event.level]} points for wasting their time by doing ${event.achievement}."`)
  }
  
  if(userObject.status) {
    if(Object.keys(userObject.user).length >= 1) {
        const updatedData = {
            discordID:userObject['user'].discordID,
            serverPoints:parseInt(userObject['user'].serverPoints) + parseInt(userGetsPoints)
        }
        if(event.achievement === 'The End?') {
          updatedData.didEnd = true;
        }
        const updatedObject = await UsersModel.updateUser(updatedData);

    }
  }


})
module.exports = router;
