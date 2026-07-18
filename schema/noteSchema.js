

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
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

url:{
 english:{
    type:String,
    required:true
 },
 hindi:{
    type:String,
    required:true
 },

},

isPremium:{
    type:Boolean,
    required:true,
    default:false
}

}, {timestamps:true})


exports.noteModel = mongoose.model("note", noteSchema);