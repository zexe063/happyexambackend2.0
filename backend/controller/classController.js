



const {classModel} = require("../schema/classSchema");


const  getClass = async(req,res)=>{
     const classData = await  classModel.find();
     res.json(classData);
     
}


const  createClass = async(req,res)=>{
 const newClassData = await classModel.insertMany(req.body);
 res.json(newClassData);

}





module.exports = {getClass,createClass};