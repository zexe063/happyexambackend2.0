

const express= require("express");
const server =  new express()
require('dotenv').config()
const db = require("./database/db")
const classRouter = require("./route/classRoute");
const subjectRouter = require("./route/subjectRoute");
const chapterRouter =require("./route/chapterRoute");
const levelRouter = require("./route/levelRoute");
const questionRouter = require("./route/questionRoute");

// dataabse connection call//
db()


const cors = require("cors");


server.use(express.json());
server.use(cors())

server.use("/class", classRouter);
server.use("/subject", subjectRouter);
server.use("/chapter", chapterRouter);
server.use("/level", levelRouter);
server.use("/question", questionRouter)


server.listen(process.env.PORT, (req,res)=>{
 console.log(`server is started ||${process.env.PORT} `)
})


