

const mongoose = require("mongoose");

const  levelSchema =  new mongoose.Schema({
    chapter_name:{
        english:{
          type:String,
          required:true
        },
      hindi:{
        type:String,
        required:true
      }
    },
        chapterId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"chapter"
        },
    level_number:{
        type:Number,
        required:true,
    },
  
        
    question:[{
   type:mongoose.Schema.Types.ObjectId,
   ref:"question"
    }]


},{timestamps:true});

exports.levelModel = mongoose.model("level", levelSchema);
