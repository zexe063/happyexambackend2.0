

const express= require("express");
const server =  new express()
require('dotenv').config()
const db = require("./database/db")
const classRouter = require("./route/classRoute");
const subjectRouter = require("./route/subjectRoute");
const chapterRouter =require("./route/chapterRoute");
const levelRouter = require("./route/levelRoute");
const questionRouter = require("./route/questionRoute");
const ReportQuestionController = require("./route/ReportQuestionRoute")
const courseRouter = require("./route/courseRouter")

// dataabse connection call//
db()


const cors = require("cors");
const ReportQuestionRouter = require("./route/ReportQuestionRoute");


server.use(express.json());
server.use(cors())
server.get("/", (req,res)=>{
    res.send("hello production happydxa")
   })
server.use("/class", classRouter);
server.use("/subject", subjectRouter);
server.use("/", courseRouter);
server.use("/chapter", chapterRouter);
server.use("/level", levelRouter);
server.use("/question", questionRouter);
server.use("/ReportQuestion", ReportQuestionRouter);


server.listen(process.env.PORT, (req,res)=>{
 console.log(`server is started ||${process.env.PORT} `)
})


