

const { request } = require("express");
const mongoose = require("mongoose");


const questionSchema = new mongoose.Schema({

  level_number:{
    type:Number
  },
  levelId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"level"
  },

  question_type:{
 type:String,
 default:"MCQ"
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
        english:[{
          type:String,
          required:true
        }],
        hindi:[{
          type:String,
          required:true
        }]
     },
     
     answer:{
  type:Number,
required:true

     },
     image:{
       type:String,
       default:null
     },
      medium:{
        type:String,
       required:true
      },


      explanation:{
       type:{
        english:{
          type:String,
          required:true
        },
        hindi:{
          type:String,
          required:true
        },
       },
       default:null
    
      },

      solution:{
        type:[
          
          {
          step:{type:Number,required:true},
          terms:{ english:{type:String, required:true},hindi:{type:String,required:true}},

         value:{ 
          _id:false,
          type:{
            image:{type:String, default:null},
          calculation:{_id:false, type:{ english:{type:String, required:true}, hindi:{type:String, required:true} },default:null}
          },

          default: null
          }
         
        }
       
        ],
      
      }
      

     
     
},{timestamps:true});

exports.questionModel = mongoose.model("question", questionSchema);