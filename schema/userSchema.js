
const mongoose =require('mongoose');


const userSchema =   mongoose.Schema({
first_name:{
        type:String,
       required:true
    },
    last_name:{
        type:String,
       required:true
    },
    email:{
        type:String,
       required:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    avatar:{
        _id:false,
       id:{
        type:Number,
        required:true
       },
       bgcolor:{
        type:String,
        required:true
       }
    },
    userPreference:{
        _id:false,
         language:{
            type:String,
            enum:['english','hindi'],
           required:true
         },
         class_name:{
            type:Number,
           required: true
         },
         heardFrom:{
            type:String,
           required:true
         },
         time:{
            type:String,
           required:true
         }

    },
     hearts:{
        type:Number,
        min:[0, "Heart alwasy greater than 0"],
       required:true
    },
    HEP:{
        type:Number,
        required:true
    },
    questionAttempt:{
        type:Number,
        required:true
    },
 recommendedChapter:{
 type:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"chapter",
  },
],
required:true
 },
    levelCompleted:{
        type:Array,
        required:true
    },
    
    isPremium:{
        type:Boolean,
        required:true
    }

    
},{timestamps:true})

exports.userModel =  mongoose.model('user', userSchema)