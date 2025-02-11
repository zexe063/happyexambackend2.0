
const { json } = require("express");
const {ReportQuestionModel, reportQuestionModel} = require("../schema/ReportQuestion");
const { report } = require("../route/questionRoute");

const getReportQuestion =  async(req, res)=>{
   try{
    const getReportQuestionData = await reportQuestionModel.find();
    res.json(getReportQuestionData)
   }
   catch(err){
    res.json(err)
   }
}
const createReportQuestion = async(req,res)=>{
    try{
        const data = await new reportQuestionModel(req.body);
        res.json(data)     

         await data.save()
    }catch(err){
        res.json(err)
    }
}
 module.exports = {getReportQuestion,  createReportQuestion};
