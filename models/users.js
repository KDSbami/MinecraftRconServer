const mongoose = require('mongoose');

const users = new mongoose.Schema({
  
  discordID: { type: String, required: true, unique:true },
  minecraftUsername: { type: String, required:true, unique:true },
  createdAt: { type:Date, default:Date.now },
  serverPoints:{ type:Number, default:5 }, 
  lastCreditedAt:{ type:Date, default:Date.now },
  lastRaffledAt:{ type:Date, default:Date.now },
  RafflesOwned:{ type:Number, default:0 },
  didEnd:{ type:Boolean, default:false }

});

const UsersModel = mongoose.model('User', users);

//read
UsersModel.findUser = async function (object) {
   try {
      const query = { discordID : object.discordID }
      const user =  await UsersModel.find(query);

      if(user.length >= 1) { return {user:user[0],status:true}; } 
      else { return { user:{},status:true };}
   }
   catch(err) {
    console.log(err);
    return {user:{},status:false};
   }
};

UsersModel.findUserWithMinecraftUsername = async function (object) {
  try {
     const query = { minecraftUsername : object.minecraftUsername }
     const user =  await UsersModel.find(query);

     if(user.length >= 1) { return {user:user[0],status:true}; } 
     else { return { user:{},status:true };}
  }
  catch(err) {
   console.log(err);
   return {user:{},status:false};
  }
};

//create
UsersModel.addUser = async function (object) {
  try {
    
    const query = { discordID: object.discordID };
    
     const user =  await UsersModel.findUser(query);
     console.log("sdasdasdasd",user)
    if(Object.keys(user.user).length < 1) {
      console.log("fsdfsd",Object.keys(user.user))
      const newUser = new UsersModel({
        discordID:object.discordID,
        minecraftUsername:object.minecraftUsername
      })

      try {

        const addedUser = await newUser.save();
        return {user:addedUser,status:true};

      } catch(error) {
        console.log(error);
        return {user:{},status:false};
      }

    } 
    else { return {user:user.user,status:false};}
  }
  catch(err) {
   console.log(err);
   return {user:{},status:false};;
  }
};

//update
UsersModel.updateUser = async function (object) {
  
  try {
    const query = { discordID: object.discordID };
    const user = object;
    const updated = await UsersModel.findOneAndUpdate(query, user ,{new:true});
    return {user:updated,status:true};
  }
  catch(error) {
    console.log(error.codeName);
    if(error.codeName === 'DuplicateKey') {
      return {user:{},status:false};
    }
    return {user:{},status:false};
  }
};

//delete
UsersModel.deleteUser = async function (req) {

    try {
      const query = { _id: req.body.id };
      const deletedUser = await UsersModel.findOneAndRemove(query);
      if(deletedUser) {
        return {user:deletedUser, status:true};
      } else {
        return {user:deletedUser, status:true};
      }
    } catch(error) {
      console.log(error);
      return {user:{}, status:false};
    }
};


module.exports = UsersModel;
