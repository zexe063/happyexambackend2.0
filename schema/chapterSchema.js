

const mongoose = require("mongoose");


const chapterSchema = new mongoose.Schema({
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
    
subject_name:{
  english:{
      type:String,
      required:true
  },
  hindi:{
      type:String,
      required:true
  }
},
class_name:{
  type:Number,
  required:true
},

subjectId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"subject"
 },

    chapter_number:{
        type: Number,
        required:true,
     },

     chapter_image:{
     type:String,
     default:null
     },
recommended:Boolean,
new:Boolean,

    level:[{
type:mongoose.Schema.Types.ObjectId,
ref:"level"
    }],


},{timestamps:true})

exports.chapterModel= mongoose.model("chapter", chapterSchema);
