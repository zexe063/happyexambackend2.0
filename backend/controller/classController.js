



const {classModel} = require("../schema/classSchema");


const  getClass = async(req,res)=>{
     const classData = await  classModel.find();
     res.json(classData);
     
}


const  createClass = async(req,res)=>{
   try{
     const newClassData = await classModel.insertMany(req.body);
     res.json(newClassData);
   }
   catch(err){
      res.json(err)
   }

}





module.exports = {getClass,createClass};