
const { json } = require("express");
const {ReportQuestionModel, reportQuestionModel} = require("../schema/ReportQuestion");
const { report } = require("../route/questionRoute");

const getReportQuestion =  async(req, res)=>{
   try{
    const getReportQuestionData = await reportQuestionModel.find();
     if(!getReportQuestion) return res.status(401).json({success:false, message:"Something went wrong"});
    res.json({success:true, result:getReportQuestionData})
   }
   catch(err){
       res.status(500).json({success:false, message:"Server Error please try again later"})
   }
}
const createReportQuestion = async(req,res)=>{
    try{
        const createReportQuestionData= await new reportQuestionModel(req.body);
         if(!createReportQuestionData) return  res.status(401).json({success:false, message:" Something went wrong"});
           await data.save()
        res.json({success:true, result:createReportQuestionData});  

    }catch(err){
           res.status(500).json({ success:false, message:"Server Error please try again later"})
    }
}
 module.exports = {getReportQuestion,  createReportQuestion};
