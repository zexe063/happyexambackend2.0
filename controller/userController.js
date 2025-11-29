
const { response, json } = require("express");
const {userModel} = require("../schema/userSchema");
const jwt =require("jsonwebtoken");
const { chapterModel } = require("../schema/chapterSchema");



const getUser = async(req,res)=>{

   try{
   const {email,password} = req.body;
   
   if(!email || !password) return res.status(400).json({success:false, message:"userId and Password is required"});
 
  
    const user = await userModel.findOne({email:email, password:password}).populate({path:"recommendedChapter", select:"-level"}).select({password:0, levelCompleted:0})
    
    if(!user) return  res.status(401).json({success:false, message:"email and password are invalid"});
    
   //  NOW AFTER USER GET DATA
      const token = jwt.sign({userId:user._id}, process.env.SECRET_KEY);
      res.cookie('userId', token, {httpOnly:true, secure:false, sameSite:"lax", maxAge:7*24*60*60*1000, path:"/"});
     res.status(200).json({success:true, result:user});

 
 }
 catch(err){
   res.status(500).json({
      success:false,
      message:"Server Error. please try again later"
   })
}
}


const verifyUser = async(req,res)=>{
   try{
       
    const userId =  jwt.verify(req.cookies?.userId, process.env.SECRET_KEY)?.userId;
    const verifiedUserData  = await userModel.findById(userId);

    if(!verifiedUserData) return req.status(404).json({success:false, message:"User not found"});

    res.status(200).json({success:true, result:verifiedUserData});

   }catch(err){
      res.status(500).json({success:false, message:"Server Error. please try again later"});
   }
}


const createUser = async(req,res)=>{
   try{
       
    const UserRegistrationData  = {...req.body, hearts:3, HEP:0,  isPremium:false, questionAttempt:0};

     const ExistedUser = await userModel.findOne({email:UserRegistrationData.email});

     if(ExistedUser)  return res.status(409).json({success:false, message:"User already registered"})
      
      const chapters = await chapterModel.find();
      const recommendedChapter = Array.from(Array(5), ()=> chapters[Math.floor(Math.random()*16)]?._id)
      Object.assign(UserRegistrationData, {recommendedChapter})

    const newUser = await new userModel(UserRegistrationData);
    if(!newUser) return res.status(401).json({success:false, message:"Something went wrong"});   

       const token = jwt.sign({userId:newUser._id}, process.env.SECRET_KEY);
         await newUser.save()

         //  SENDING COOKIE
      res.cookie('userId', token, {httpOnly:true, secure:true, sameSite:"strict", maxAge:7*24*24*60*1000});

      // POPULATE RECCOMENDED CHAPTER
      const newuserData = await userModel.findById(newUser._id).populate({path:"recommendedChapter", select:"-level"}).select({password:0,levelCompleted:0});

      // SEDING RESPONSE
   res.status(200).json({success:true, result:newuserData});
     
   
   
  
   }
   catch(err){
      res.status(500).json({
        success:false,
        message:"Server Error. please try again later"
      })
    
      
   }
   
}

// USER PROGRESS UPDATE

const progressUser= async(req,res)=>{

try{
  
 if(!req.body.action && !req.body.userId) return  res.status(400).json({success:false, message:"Action or userId missing in request."});

 const {userId,action} = req.body
 
 


 switch(action){
    case 'HEART-LOST':
        const userHeartLostData = await userModel.findByIdAndUpdate(
          userId,
          {
            $inc:{hearts:-1}
         },

         {
         new:true, 
         runValidators:true
          }

         ).select({hearts:1})

          if(!userHeartLostData) return res.status(404).json({success:false, action:"HEART-LOST",message:"userId not valid"})
            
       res.status(200).json({action:"HEART-LOST",result:userHeartLostData});
     
    

      break;

      case 'HEART-REFILL':
       
           const userHearRefillData = await userModel.findByIdAndUpdate(
            userId, 
            {
               $inc:{hearts:3}
            }, 
            {
               new:true,  
               runValidators:true
            }
              ).select({hearts:1})

         if(!userHearRefillData) return res.status(404).json({ success:false, action:"HEART-REFILL",message:"userId not valid"})

          res.status(200).json({action:"HEART-REFILL", result:userHearRefillData})
      
      
      break;

       case  'LEVEL-COMPLETED':
         const payload = req.body?.payload 
         if(!payload) return res.status(404).json({success:false, message:"Payload is not defined"});

        const user = await userModel.findById(userId)
       
        if(!user) return res.status(404).json({success:false, message:"user not found"});
        const chapter = user.levelCompleted.find((item)=> payload.chapterId === item.chapterId);
      
      
          if(chapter){
           
            const alreadyCompleted = chapter.levels.includes(payload.levelId);
         
             if(!alreadyCompleted){
               const updatedData = await userModel.findOneAndUpdate(
                  {
                     _id:userId, 
                     "levelCompleted.chapterId": payload.chapterId
                  }, 
                  
                  {
                     $push:{'levelCompleted.$.levels':payload.levelId},
                     $inc:{HEP:payload.HEP,questionAttempt:10}
                     
                     
                  },
            
                  {new:true}
                  
               ).select({HEP:1, questionAttempt:1});
              
               return res.status(200).json({ action:"LEVEL-COMPLETED", message:"Existing chapter level is Updated", response:updatedData });
             }
             
             return res.status(200).json({action:"LEVEL-COMPLETED", message:"Level is already Existed so no reward", response:{_id:user._id, HEP:user.HEP, questionAttempt:user.questionAttempt} })
             
             
          }
          else{
             const chapterData = {chapterId:payload.chapterId, chapter_name:{...payload.chapter_name},levels:[payload.levelId]}

            const updatedData = await userModel.findByIdAndUpdate(
               userId, 
               {
               $push:{levelCompleted:chapterData},
               $inc:{HEP:payload.HEP,questionAttempt:10}
               },

              {new:true} 
            ).select({HEP:1, questionAttempt:1})
            res.status(200).json({action:"LEVEL-COMPLETED", message:"New chapter is created", result:updatedData })
          }

           
          
          
       
         break;

         
         case 'SUBSCRIPTION':
             const userSubscriptionData = await userModel.findByIdAndUpdate(userId,{$set:{isPremium:true}}, {new:true, runValidators:true}).select({isPremium:1})

             if(!userSubscriptionData) return res.status(404).json({action:"SUBSCRIPTION",message:"userId not valid"})
             res.status(200).json({action:"SUBSCRIPTION",response:userSubscriptionData})

            break;

        default:
      res.status(401).json({success:false, message:"Unknown event Update case"})

 }


}
catch(err){
res.status(401).json({success:false, message:"Server Error: please try again later"})
}
}

// USER PROFILE UPDATE

const  userProfile = async(req,res)=>{
   try{

   if(!req.body.payload) return res.status(401).json({success:false, message:" Payload is required"});
   const userId = jwt.verify(req.cookies.userId, process.env.SECRET_KEY).userId


   const payload = req.body.payload
  
   const userUpdate = await userModel.findByIdAndUpdate(
      userId,
       {
         $set:payload
      },
      
   {
      new:true,
      runValidators:true
   }

   ).select({_id:1, first_name:1, last_name:1,avatar:1, userPreference:1})
   if(!userUpdate) return res.status(401).json({success:false, message:"Something went wrong"});
   res.status(200).json({ success:true, message:"Personal info update Sucessfull", result:userUpdate});
}
catch(err){
 if(err.name === "JsonWebTokenError"){
   res.status(401).json({success:false, message:"Active user required. Please login again"})
 }
 else{
    console.log(err)
      res.status(500).json({success:false, message:"Server Error please try again later"})
 }

}

}
// USER PASSWORD UPDATE
const userPassword = async(req,res)=>{

   try{

 const userId = jwt.verify(req.cookies.userId, process.env.SECRET_KEY).userId
 const {currentPassword, newPassword}  = req.body;


 const  user = await userModel.findById(userId);

  if(user.password === currentPassword){
    const passwordUpdate  = await userModel.findByIdAndUpdate(userId, { $set: {'password':newPassword}}, {new:true});

      if(passwordUpdate) return  res.status(200).json({success:true, message:"Password update sucessfully"})
  } 
else{
   res.status(401).json({success:false, message:"current password is invalid"});
}
  
   }
   catch(err){

      if(err.name === "JsonWebTokenError"){
   return res.status(401).json({success:false, message:"Active user required. Please login again"})
 }
      res.status(500).json({success:false, message:"Server Error please try again later"})

   }

}

module.exports = {getUser, verifyUser, createUser, progressUser,userProfile, userPassword}