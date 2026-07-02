

const express= require("express");
const server =  new express()
require('dotenv').config()
const db = require("./database/db")
const classRouter = require("./route/classRoute");
const subjectRouter = require("./route/subjectRoute");
const chapterRouter =require("./route/chapterRoute");
const levelRouter = require("./route/levelRoute");
const questionRouter = require("./route/questionRoute");
const reportQuestionRouter = require("./route/reportQuestionRoute");
const courseRouter = require("./route/courseRoute")
const userRouter = require("./route/userRoute")
const cookieParse = require("cookie-parser");
const jwt = require("jsonwebtoken");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const corsOption = {
 origin:true,
 credentials:true
}
const cors = require("cors");

// database connection call//
db()


server.use(express.json());
server.use(cors(corsOption))
server.use(cookieParse())
server.get("/", (req,res)=>{
    res.send("hello production happydxa")
   })



server.use('/user', userRouter)
server.use("/class", classRouter);
server.use("/subject", subjectRouter);
server.use("/course", courseRouter);
server.use("/chapter", chapterRouter);
server.use("/level", levelRouter);
server.use("/question", questionRouter);
server.use("/reportquestion", reportQuestionRouter);

 



server.listen(process.env.PORT, '0.0.0.0', (req,res)=>{
 console.log(`server is started ||${process.env.PORT} `)
})


