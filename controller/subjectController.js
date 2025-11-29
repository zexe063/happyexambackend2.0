


const e = require("express");
const { classModel } = require("../schema/classSchema");
const {subjectModel} =  require("../schema/subjectSchema");


const getSubject = async(req,res)=>{
   try{
    const  {class_name} = req.params;

     const getSubjectData =  await classModel.findOne({class_name:class_name})
     .populate({
        path:"subject",
     }).select({"subject":1,"_id":0})

   
     if(!getSubjectData) return  res.status(401).json({success:false, message:"invalid class-name"})
        res.json({success:true, result:getSubjectData.subject})

   }
   catch(err){

      res.status(500).json({success:false, message:"Server Error please try again later"})

   }

}


 const createSubject = async(req,res)=>{

    try{
        const  {class_name} = req.params;
  const classId = await classModel.findOne({class_name:class_name});

if(!classId) return res.status("401").json({success:false, message:"invalud class-name"})

const data = req.body.map((item)=>  ({...item ,["classId"]:classId._id,["class_name"]:classId.class_name}));

const newSubjectData = await subjectModel.insertMany(data);
if(!newSubjectData) return res.status(401). json({success:false, message:"Something went wrong"})

 const subjectId  =  newSubjectData.map((subject)=>subject._id);


const updateClass= await  classModel.findByIdAndUpdate(classId._id,
    {$push:{
        subject:{
            $each:subjectId
        }
    }},
    {new:true});

 res.json({success:true, result:newSubjectData});

    }
    catch(Error){
           res.status(500).json({success:false, message:"Server Error please try again later"})
    }

 }


 

 module.exports = {getSubject,createSubject}