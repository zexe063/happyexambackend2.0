

const express = require("express");
const questionRouter = express.Router();

const {getQuestion, createQuestion} = require("../controller/questionController");


questionRouter.get("/:class_name/:subject_name/:chapter_number/:level_number",getQuestion);
questionRouter.post("/:class_name/:subject_name/:chapter_number/:level_number", createQuestion);

 module.exports =questionRouter;