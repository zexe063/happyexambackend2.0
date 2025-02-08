

const express = require("express");
const  levelRouter = express.Router();
const {getLevel, createLevel } = require("../controller/levelController");

levelRouter.get("/:class_name/:subject_name/:chapter_number", getLevel)
  levelRouter.post("/:class_name/:subject_name/:chapter_number", createLevel)
module.exports = levelRouter;