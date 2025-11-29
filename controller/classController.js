



const {classModel} = require("../schema/classSchema");


const  getClass = async(req,res)=>{
    try{
       const classData = await  classModel.find();
        if(!classData) return res.status(404).json({success:false, message:"class-name not found"})
        res.json({success:true, result:classData});
    }
    catch(err){
       res.status(500).json({success:false, message:"Server Error please try again later"})
    }
     
}


const  createClass = async(req,res)=>{
   try{
     const newClassData = await classModel.insertMany(req.body);

     if(!newClassData) return res.status(401).status({success:false, message:"Something went wrong"});
     res.json({success:true,result:newClassData});
   }
   catch(err){
       res.status(500).json({success:false, message:"Server Error please try again later"})
   }

}





module.exports = {getClass,createClass};