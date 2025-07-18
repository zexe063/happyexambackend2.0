


const e = require("express");
const { classModel } = require("../schema/classSchema");
const {subjectModel} =  require("../schema/subjectSchema");


const getSubject = async(req,res)=>{
   try{

    const  {class_name} = req.params;
    console.log(class_name)
     const getSubjectData =  await classModel.findOne({class_name:class_name})
     .populate({
        path:"subject",
    
        
     }).select({"subject":1,"_id":0})

   
     if(!getSubjectData) return  res.status(401).json("invalid class_name")
        res.json(getSubjectData.subject)

   }
   catch(err){

    res.status(401).json(err);

   }

}


 const createSubject = async(req,res)=>{

    try{
        const  {class_name} = req.params;
  const classId = await classModel.findOne({class_name:class_name});

if(!classId) return res.status("401").json("invalud class_name")

const data = req.body.map((item)=>  ({...item ,["classId"]:classId._id,["class_name"]:classId.class_name}));
console.log(data)
console.log("nothing hapend")

const newSubjectData = await subjectModel.insertMany(data);
res.json(newSubjectData);

 const subjectId  =  newSubjectData.map((subject)=>subject._id);


const updateClass= await  classModel.findByIdAndUpdate(classId._id,
    {$push:{
        subject:{
            $each:subjectId
        }
    }},
    {new:true});

console.log(updateClass);
    }
    catch(Error){
        res.status(401).json(Error)
    }

   


 }


 

 module.exports = {getSubject,createSubject}