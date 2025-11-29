
const mongoose = require("mongoose");


  
async function db(req,res){
 try{

  const databaseEstablished = await  mongoose.connect(process.env.MOONGOOSE).then((connect)=>{
    console.log(`📦 Connected to MongoDB|| ${connect.connection.host}`)
  })

 }
 catch(err){
console.log(err);
 }
 
 
 
}

 module.exports = db;