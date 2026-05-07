

const  mongoose = require("mongoose");

 const reportQuestionSchema =  mongoose.Schema({
   userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user",
      required:true
   },
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
 description:{
   type:String,
   required:true
 }

 })

 exports.reportQuestionModel =  mongoose.model("reportQuestion", reportQuestionSchema)