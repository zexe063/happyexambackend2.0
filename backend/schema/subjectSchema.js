

const mongoose = require("mongoose");




const subjectSchema = new mongoose.Schema({
    class_name:{
        type:String,
        required:true
     },
     classId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"class"
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
      subject_image:{
        type:String,
        default :null
      },
    chapter:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"chapter"
    }]

    
        

},{timestamps:true})

exports.subjectModel = mongoose.model("subject", subjectSchema);