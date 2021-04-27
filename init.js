const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const db = require('./database/index');
const  user  = require('./routes/user');
const  discordShop  = require('./routes/discordShop');
const  MCServer  = require('./routes/minecraftServer');
const  raffles  = require('./routes/raffles');
require('dotenv').config({path:__dirname+'/./../.env'});
const app = express();
console.log("test")
app.use(morgan('dev'));
app.use(cors());


db.on('error', console.error.bind(console, 'MongoDB connection error:'))
app.use('/server',MCServer);
app.use('/user',user);
app.use('/discordShop',discordShop);
app.use('/raffle',raffles);

app.listen(5000)