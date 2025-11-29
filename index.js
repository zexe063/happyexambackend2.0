

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
const userRouter = require("./route/userRouter")
const cookieParse = require("cookie-parser");
const jwt = require("jsonwebtoken");

// database connection call//
db()

const corsOption ={
 origin:true,
 credentials:true
}
const cors = require("cors");
const ReportQuestionRouter = require("./route/ReportQuestionRoute");


server.use(express.json());
server.use(cors(corsOption))
server.use(cookieParse())
server.get("/", (req,res)=>{
    res.send("hello production happydxa")
   })

server.use('/user', userRouter)
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


