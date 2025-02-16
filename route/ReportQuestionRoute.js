

const express = require("express");
const ReportQuestionRouter = express.Router();
const {getReportQuestion , createReportQuestion} = require("../controller/ReportQuestionController");

ReportQuestionRouter.get("/", getReportQuestion)
ReportQuestionRouter.post("/", createReportQuestion);

 module.exports = ReportQuestionRouter;

