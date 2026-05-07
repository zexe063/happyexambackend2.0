
const {subjectModel} = require("../schema/subjectSchema")
const {chapterModel} = require("../schema/chapterSchema");



const getCourse  = async(req,res)=>{
   try{
       const {classId}= req.params;
      const getCourseData= await subjectModel.find({class_name:classId}).select({subject_image:0,createdAt:0, updatedAt:0, classId:0,class_name:0}).populate({path:"chapter", select:"-level -createdAt -updatedAt"});

     if(!getCourseData|| !getCourseData.length) return res.status(401).json({success:false, message:"Something went wrong"})
      res.status(200).json({success:true, result:getCourseData})

   }
catch(err){
   console.log(err)
   res.status(500).json({success:false, message:"Server Error please try again later"})
}

}
   

module.exports = {getCourse}