
const express = require("express");
const classRouter = express.Router();
const {getClass,createClass} = require("../controller/classController")

classRouter.get("/",getClass);
classRouter.post("/",createClass);


module.exports = classRouter;