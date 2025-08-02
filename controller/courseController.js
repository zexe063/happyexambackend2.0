
const {subjectModel} = require("../schema/subjectSchema")
const {chapterModel} = require("../schema/chapterSchema");

const getHome = async(req, res)=>{
        const getHomeData = await chapterModel.find({$and:[{class_name:10, recommended:true}]},{level:0})
    res.json(getHomeData)

}

const getCourse  = async(req,res)=>{
    const getCourseData= await subjectModel.find({class_name:10},{subject_image:0,createdAt:0, updatedAt:0, classId:0,class_name:0}).populate({path:"chapter", select:"-level -createdAt -updatedAt"});
     res.json(getCourseData)

}
   

module.exports = {getHome,getCourse}