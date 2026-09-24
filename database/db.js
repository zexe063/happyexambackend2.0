
const mongoose = require("mongoose");



  
async function db(req,res){
 try{

  const databaseEstablished = await  mongoose.connect(process.env.MONGOOSE, {
    maxPoolSize:50,
    minPoolSize:5,
    serverSelectionTimeoutMS:5000,
    socketTimeoutMS:45000 
  }).then((connect)=>{
    console.log(`📦 Connected to MongoDB|| ${connect.connection.host}`)
  })

 }
 catch(err){
console.log(err);
 }
 
 
 
}

 module.exports = db;