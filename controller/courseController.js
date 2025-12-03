
const {subjectModel} = require("../schema/subjectSchema")
const {chapterModel} = require("../schema/chapterSchema");

const getHome = async(req, res)=>{
        const getHomeData = await chapterModel.find({$and:[{class_name:10, recommended:true}]},{level:0})
    res.json(getHomeData)

}

const getCourse  = async(req,res)=>{
   try{
     
      const getCourseData= await subjectModel.find({class_name:10},{subject_image:0,createdAt:0, updatedAt:0, classId:0,class_name:0}).populate({path:"chapter", select:"-level -createdAt -updatedAt"});
     if(!getCourse) res.json(401).status({success:false, message:"Something went wrong"})
      res.status(200).json({success:true, result:getCourseData})
   }
catch(err){
   res.status(500).json({success:false, message:"Server Error please try again later"})
}

}
   

module.exports = {getHome,getCourse}