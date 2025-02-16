

const mongoose = require("mongoose");



const classSchema = new mongoose.Schema({
    class_name:{
        type:Number,
        required:true
    },
    subject:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"subject"
    }]
},{timestamps:true});



exports.classModel =  mongoose.model("class", classSchema);
