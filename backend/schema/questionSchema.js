

const mongoose = require("mongoose");


const questionSchema = new mongoose.Schema({

  level_name:{
    type:String
  },
  levelId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"level"
  },
 
     question_name:{
      english:{
        type:String,
        required:true
      },
      hindi:{
        type:String,
        required:true
      }
     },
     
   
     
     option:{
        english:[
         {type:String}
        ],
        hindi:[
          {
            type:String
          }
        ]
     },
     
     answer:{
  type:Number,
required:true

     },
     image:{
       type:String,
     
     },
      medium:{
        type:String,
        
      },
      explanation:{
        english:{
          type:String,
          required:true
        },
        hindi:{
          type:String,
          required:true
        }
      }

     
     
},{timestamps:true});

exports.questionModel = mongoose.model("question", questionSchema);