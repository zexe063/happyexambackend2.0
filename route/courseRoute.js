

const express = require("express");
const courseRouter = express.Router();
const { getCourse } = require("../controller/courseController");

courseRouter.get("/:classId", getCourse);

module.exports = courseRouter;