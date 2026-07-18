

const {noteModel} = require("../schema/noteSchema");

const getNotes = async(req,res)=>{
    try{
        const getNotesData= await noteModel.find({});
         if(getNotesData) res.status(200).json({success:true,result:getNotesData});
         else return res.status(400).json({success:false, message:"Something went wrong"});
    }
    catch(err){
        res.status(500).json({success:false,message:"Server Error please try again later"});
    }


}


const createNotes = async(req, res)=>{
    try{
         if(!req.body) return res.status(400).json({success:false, message:"Payload is reuired"});

     const newNotesData = await noteModel.insertMany(req.body) 
      if(newNotesData) return res.status(201).json({success:true, result:newNotesData})
      
    }
    catch(err){
        res.status(500).json({success:false,message:"Server Error please try again later"});
    }
}

module.exports = {getNotes, createNotes};
