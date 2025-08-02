

const express = require("express");
const chapterRouter =  express.Router();
const {getChapter, getCourse, createChapter} = require("../controller/chaptercontroller");

chapterRouter.get("/course/:class_name", getCourse);
chapterRouter.get("/:class_name/:subject_name", getChapter)
 chapterRouter.post("/:class_name/:subject_name",createChapter);


  module.exports  = chapterRouter;