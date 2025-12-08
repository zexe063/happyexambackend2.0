const rateLimit = require('express-rate-limit')


 const loginLimiter =  rateLimit({
    windowMs: 15 * 60 * 1000,
    max:5,
    message:{success: false,message:'Too many attempts, please try again after 15 minutes'}
})

 const signupLimiter =  rateLimit({
    windowMs: 60 * 60 * 1000,
    max:3,
    message:{success: false,message:'Too many attempts, please try again after 1 hours'}
})



const changePasswordLimiter =rateLimit({
    windowMs:15*60*1000,
    max:3,
    message:{success:false, message:"Too many attempts, please try again after 15 minutes"}
})




 module.exports = {loginLimiter,signupLimiter,  changePasswordLimiter}