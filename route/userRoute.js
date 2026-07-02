


const express =require('express');

const {loginLimiter, signupLimiter, changePasswordLimiter} = require("../middleware/rateLimiter")
const { getUser, verifyUser, createUser, ProgressEvent, userProfile, userPassword, progressEvent, deleteUser} = require('../controller/userController');
const userRouter = express.Router();

 userRouter.get("/verify", verifyUser);
 userRouter.post("/login", loginLimiter, getUser)
 userRouter.post("/signup", signupLimiter, createUser)
 userRouter.put('/progress/event', progressEvent)
 userRouter.put("/profile", userProfile)
 userRouter.put("/password", changePasswordLimiter, userPassword)
 userRouter.delete("/delete", deleteUser);

module.exports = userRouter;