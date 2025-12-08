

const express = require("express");
const reportQuestionRouter = express.Router();
const {getReportQuestion , createReportQuestion} = require("../controller/reportQuestionController");

reportQuestionRouter.get("/", getReportQuestion)
reportQuestionRouter.post("/", createReportQuestion);

 module.exports = reportQuestionRouter;

