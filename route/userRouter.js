


const express =require('express');
const { getUser, verifyUser, createUser, progressUser, userProfile, userPassword} = require('../controller/userController');
const userRouter = express.Router();
 userRouter.get("/verify", verifyUser);
 userRouter.post("/login",getUser)
 userRouter.post("/signup", createUser)
 userRouter.put('/progress/event', progressUser)
 userRouter.put("/profile", userProfile)
 userRouter.put("/password",userPassword)

module.exports = userRouter;