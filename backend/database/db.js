
const mongoose = require("mongoose");


  
function db(){
 try{

  const databaseEstablished = mongoose.connect(process.env.MOONGOOSE).then((connect)=>{
    console.log(`📦 Connected to MongoDB|| ${connect.connection.host}`)
  })

 }
 catch(err){
  console.log("error")
 }
 
 
}

 module.exports = db;