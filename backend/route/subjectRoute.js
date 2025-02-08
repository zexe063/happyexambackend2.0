


const express = require("express");
const subjectRouter = express.Router();
const {getSubject,createSubject} = require("../controller/subjectController");

subjectRouter.get("/:class_name", getSubject);
subjectRouter.post("/:class_name", createSubject);
module.exports = subjectRouter;