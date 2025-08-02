

const express = require("express");
const courseRouter = express.Router();
const { getHome, getCourse } = require("../controller/courseController");

courseRouter.get("/home/:classId", getHome);
courseRouter.get("/course/:classId", getCourse);

module.exports = courseRouter;