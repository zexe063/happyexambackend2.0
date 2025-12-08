
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
         if(!req.body.questionId || !req.body.value) return res.status(401).json({success:"false", message:"questionId and value is required"})

        const createReportQuestionData= await new reportQuestionModel(req.body);
         if(!createReportQuestionData) return  res.status(401).json({success:false, message:" Something went wrong"});
         
       await createReportQuestionData.save()

        res.status(200).json({success:true, message:"Ticket created successfuly", result:createReportQuestionData});  

    }catch(err){
           res.status(500).json({ success:false, message:"Server Error please try again later"})
    }
}
 module.exports = {getReportQuestion,  createReportQuestion};
