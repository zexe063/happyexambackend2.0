const bcrypt = require("bcryptjs");
const {userModel} = require("../schema/userSchema");
const jwt =  require("jsonwebtoken");
const { chapterModel } = require("../schema/chapterSchema");
const mongoose  = require("mongoose");




const getUser = async(req,res)=>{

   try{
   const {email,password} = req.body;
   
   if(!email || !password) return res.status(400).json({success:false, message:"userId and Password is required"});
 
  
    const user = await userModel.findOne({email:email}).populate({path:"recommendedChapter",select:"-level"}).select("+password");

    if(!user)  return res.status(401).json({success:false, message:"email and password are invalid"})

   const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return  res.status(401).json({success:false, message:"email and password are invalid"});

     delete user._doc.password;
   //  NOW AFTER USER GET DATA
   const token = jwt.sign({userId:user._id}, process.env.SECRET_KEY);
   
   res.cookie('userId', token, {httpOnly:true, secure:false, sameSite:"lax", maxAge:7*24*60*60*1000, path:"/"});
    res.status(200).json({success:true, result:user});

 
 }
 catch(err){
   console.log(err)
   res.status(500).json({
      success:false,
      message:"Server Error. please try again later",
   })
}
}


const verifyUser = async(req,res)=>{
   try{

    const userId =  jwt.verify(req.cookies?.userId, process.env.SECRET_KEY)?.userId;

    const verifiedUserData  = await userModel.findById(userId).populate({path:"recommendedChapter", select:"-level"});

    if(!verifiedUserData) return res.status(404).json({success:false, message:"User not found"});

    res.status(200).json({success:true, result:verifiedUserData});

   }catch(err){
      if(err.name ==="JsonWebTokenError") return res.status(401).json({success:"false", message:"User token verify failed"})
      res.status(500).json({success:false, message:"Server Error. please try again later"});
   }
}


const createUser = async(req,res)=>{
   try{

       const password =  await bcrypt.hash(req.body.password, 10);

    const UserRegistrationData  = {...req.body, password:password, hearts:3, HEP:0,  isPremium:false, questionAttempt:0};

     const ExistedUser = await userModel.findOne({email:UserRegistrationData.email});

     if(ExistedUser)  return res.status(409).json({success:false, message:"User already registered"})
      
      const chapters = await chapterModel.find();
      const recommendedChapter = Array.from(Array(5), ()=> chapters[Math.floor(Math.random()*16)]?._id)
      Object.assign(UserRegistrationData, {recommendedChapter})

    const newUser = await new userModel(UserRegistrationData);
    if(!newUser) return res.status(401).json({success:false, message:"Something went wrong"});   

       const token = jwt.sign({userId:newUser._id}, process.env.SECRET_KEY);
         await newUser.save()

      // POPULATE RECCOMENDED CHAPTER
      const newuserData = await userModel.findById(newUser._id).populate({path:"recommendedChapter", select:"-level"})

      // SEDING RESPONSE
   res.cookie('userId', token, {httpOnly:true, secure:false, sameSite:"lax", maxAge:7*24*60*60*1000, path:"/"});
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

const progressEvent= async(req,res)=>{

try{

  const userId = jwt.verify(req.cookies?.userId, process.env.SECRET_KEY)?.userId;

 if(!req.body.action && !userId) return  res.status(400).json({success:false, message:"Action or userId missing in request."});

 const {action} = req.body
 
 


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
               $inc:{hearts:5}
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
         const payload = req.body?.payload;
         if(!payload) return res.status(404).json({success:false, message:"Payload is not defined"});

        const user = await userModel.findById(userId).select("+courseCompleted")
        if(!user) return res.status(404).json({success:false, message:"user not found"});

        const chapterResult = await chapterModel.findOne({'chapter_name.english': payload.chapter_name})
        if(!chapterResult)  return res.status(404).json({success:false, message:"chapter is not valid"})

        const chapterId = chapterResult._id.toString();
        const chapter = user.courseCompleted.find((item)=>chapterId === item.chapterId);
   
      
      
          if(chapter){
           
            const alreadyCompleted = chapter.levels.includes(payload.levelId);
         
             if(!alreadyCompleted){
               const updatedData = await userModel.findOneAndUpdate(
                  {
                     _id:userId, 
                     "courseCompleted.chapterId": chapterId
                  }, 
                  
                  {
                     $push:{'courseCompleted.$.levels':payload.levelId},
                     $inc:{HEP:payload.HEP,questionAttempt:10}
                     
                     
                  },
            
                  {new:true}
                  
               ).select("+courseCompleted")
               
                if(!updatedData) return res.status(401).json({success:false,message:"Something went wrong in existing level update"})

              const sortChapter = updatedData.courseCompleted.sort((a,b)=> b.levels.length - a.levels.length).slice(0,5).map((item)=> new mongoose.Types.ObjectId(item.chapterId))

            const newRecommendeChapter = updatedData.recommendedChapter;
            newRecommendeChapter.splice(0, sortChapter.length, ...sortChapter);
            

             const userUpdateData = await userModel.findByIdAndUpdate(
                     userId, 
                     {
                      $set:{
                     recommendedChapter:newRecommendeChapter
                      }
                     }, 

                     {new:true})
                 
                     
                  
                  return res.status(200).json({ action:"LEVEL-COMPLETED", success:true, message:"Existing chapter level is Updated", result:{ HEP:updatedData.HEP, questionAttempt:updatedData.questionAttempt}});

               
             }

             return res.status(200).json({action:"LEVEL-COMPLETED", success:true, message:"Level is already Completed so no reward", result:{HEP:user.HEP, questionAttempt:user.questionAttempt} })
             
          }
          else{
             const chapterData = {chapterId:chapterId, chapter_name:{...chapterResult?.chapter_name},levels:[payload.levelId]}

         
            const updatedData = await userModel.findByIdAndUpdate(
               userId, 
               {
               $push:{courseCompleted:chapterData},
               $inc:{HEP:payload.HEP,questionAttempt:10}
               },

              {new:true} 
            ).select("+courseCompleted");
             

             if(!updatedData) return res.status(401).json({success:false,message:"Something went wrong in existing level update"})

              const sortChapter = updatedData.courseCompleted.sort((a,b)=> b.levels.length - a.levels.length).slice(0,5).map((item)=> new mongoose.Types.ObjectId(item.chapterId))

            const newRecommendeChapter = updatedData.recommendedChapter;
            newRecommendeChapter.splice(0, sortChapter.length, ...sortChapter);
            

             const userUpdateData = await userModel.findByIdAndUpdate(
                     userId, 
                     {
                      $set:{
                     recommendedChapter:newRecommendeChapter
                      }
                     }, 

                     {new:true})
                 
            
            res.status(200).json({action:"LEVEL-COMPLETED", success:true, message:"New chapter is created", result: { HEP:updatedData.HEP, questionAttempt:updatedData.questionAttempt} })
          }

           
          
          
       
         break;

         
         case 'SUBSCRIPTION':
             const userSubscriptionData = await userModel.findByIdAndUpdate(userId,{$set:{isPremium:true}}, {new:true, runValidators:true}).select({isPremium:1})

             if(!userSubscriptionData) return res.status(404).json({action:"SUBSCRIPTION", success:true, message:"Something went wrong"})
             res.status(200).json({action:"SUBSCRIPTION",result:userSubscriptionData})

            break;

        default:
      res.status(401).json({success:false, message:"Unknown event Update case"})

 }


}
catch(err){
 if(err.name ==="JsonWebTokenError") return res.status(401).json({success:"false", message:"User token verify failed"})
res.status(501).json({success:false, message:"Server Error: please try again later"})
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
   res.status(200).json({ success:true, message:"Saved successfully!", result:userUpdate});
}
catch(err){
 if(err.name === "JsonWebTokenError"){
   res.status(401).json({success:false, code:"TOKEN_FAILED", message:"Active user required"})
 }
 else{
      res.status(500).json({success:false, message:"Server Error please try again later"})
 }

}



}
// USER PASSWORD UPDATE
const userPassword = async(req,res)=>{
   
   try{
  if(!req.body.currentPassword  || !req.body.newPassword) return res.status(401).json({success:false, message:"currentPassowrd and newPassword is required"})

  const userId = jwt.verify(req.cookies.userId, process.env.SECRET_KEY).userId

 const {currentPassword, newPassword}  = req.body;

 const hashPassword = await bcrypt.hash(newPassword,  10);
 

 const  user = await userModel.findById(userId).select("+password")
 const isMatch  = await bcrypt.compare(currentPassword, user.password); 

  if(!isMatch) return res.status(401).json({success:false, message:"current password is invalid"});
 
    const passwordUpdate  = await userModel.findByIdAndUpdate(
      userId, 
      {
          $set:{'password':hashPassword }
      }, 
      {new:true}
   );
     res.status(200).json({success:true, message:"Password update successfully"})
   
   }
   catch(err){

      if(err.name === "JsonWebTokenError"){
   return res.status(401).json({success:false, code:"TOKEN_FAILED", message:"Active user required. Please login again"})
 }
      res.status(500).json({success:false, message:"Server Error please try again later"})

   }

}



const  deleteUser = async(req,res)=>{
  try{
   const userId = req.body.userId;
      if(!userId) return res.status(404).json({success:false, message:"userId is required"})
       const deleteUserData = await userModel.deleteOne({_id:userId})
        
       if(deleteUserData) return res.status(200).json({success:200, message:"userId delete successfully"});

  }
  catch(err){
   res.status(500).json({success:false, message:"Server Error please try again later"})
  } 
}

module.exports = {getUser, verifyUser, createUser,progressEvent, userProfile, userPassword, deleteUser}


