

const  mongoose = require("mongoose");

 const reportQuestionSchema =  mongoose.Schema({
 questionId:{
    type:String,
    required:true
 },
 value:{
   type:[
      {
         type:String,
         required:true
      }
   ],
   required:true
   
 },

 })

 exports.reportQuestionModel =  mongoose.model("reportQuestion", reportQuestionSchema)