

const  mongoose = require("mongoose");

 const ReportQuestionSchema =  mongoose.Schema({
 questionId:{
    type:String,
    required:true
 },
 value:{
    type:String,
    required:true
 }

 })

 exports.reportQuestionModel =  mongoose.model("ReportQuestion", ReportQuestionSchema)