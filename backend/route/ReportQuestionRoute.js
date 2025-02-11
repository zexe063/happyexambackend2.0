

const express = require("express");
const ReportQuestionRouter = express.Router();
const {getReportQuestion , createReportQuestion} = require("../controller/ReportQuestionController");

ReportQuestionRouter.get("/ReportQuestion", getReportQuestion)
ReportQuestionRouter.post("/ReportQuestion", createReportQuestion);

 module.exports = ReportQuestionRouter;

