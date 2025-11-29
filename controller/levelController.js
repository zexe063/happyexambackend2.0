


const { classModel } = require("../schema/classSchema");
const {levelModel} = require("../schema/levelSchema");
const {chapterModel} = require("../schema/chapterSchema");
const chapterRouter = require("../route/chapterRoute");
const { userModel } = require("../schema/userSchema");
const jwt = require("jsonwebtoken");




const getLevel = async(req,res)=>{
  
  try{
  
 const userId  = jwt.verify(req.cookies?.userId, process.env.SECRET_KEY).userId;
 
  if(!userId) res.status(404).json({success:false, message:"userId is not Valid"});
  
    const  {class_name, subject_name, chapter_number} =  req.params;
    const getLevelData =   await classModel.aggregate([
      
      {
        $match:{
          class_name:Number(class_name)
        }
      },

      {
        $lookup:{
          from:"subjects",
          localField:"subject",
          foreignField:"_id",
          pipeline:[
            {
              $match:{
                "subject_name.english":subject_name
              }
            }
          ],
          as:"subjectData"
        }
      },

      {
        $lookup:{
          from:"chapters",
          localField:"subjectData.chapter",
          foreignField:"_id",
          pipeline:[
            {
              $match:{
               $or:[
                {chapter_number:Number(chapter_number)},
                {"chapter_name.english" : chapter_number}
               ]
              }
            }
          ],
          as:"chapterData"
        }
      },


      {
        $lookup:{
          from:"levels",
          localField:"chapterData.level",
          foreignField:"_id",
          as:"levelData"
        }
      },

      {
        $match:{
          levelData:{$ne:[]}
        }
      },
      {
      $unwind:"$levelData"
      },
      {
        $replaceRoot:{
          newRoot:"$levelData"
          
        }
      }
      
    
       
    ])

    if(!getLevelData || !getLevelData.length) return res.status(401).json({success:false, message:"class-name || subject-name || chapter-number is invalid"})

    const user = await userModel.findById(userId);
 if(!user) return res.status(404).json({success:false, message:"user not found"});
 
 const levels =  user.levelCompleted.find((item)=> item.chapterId === getLevelData[0]?.chapterId.toString())?.levels || []



  const isLevelCompletedData = getLevelData.map((level)=>{
       return {...level, isCompleted: levels.toString().includes(level?._id)}
     })
    

      for(let i=0; i<isLevelCompletedData.length;i++){
     if(!isLevelCompletedData[i]?.isCompleted) {
         isLevelCompletedData[i] = {...isLevelCompletedData[i], isSolveable:true}
         break;
     }
   }

  res.status(200).json({success:true , result:isLevelCompletedData})


}
catch(err){
 res.status(500).json({success:false, message:"Server Error please try again later"})
}

}

// HERE THE CREATELEVEL

const  createLevel  =   async(req,res)=>{
    
  try{
    const  {class_name, subject_name, chapter_number} =  req.params;

 
    const chapterId =   await classModel.aggregate([
      
      {
        $match:{
          class_name:Number(class_name)
        }
      },

      {
        $lookup:{
          from:"subjects",
          localField:"subject",
          foreignField:"_id",
          pipeline:[
            {
              $match:{
                "subject_name.english":subject_name
              }
            }
          ],
          as:"subjectData"
        }
      },

      {
        $lookup:{
          from:"chapters",
          localField:"subjectData.chapter",
          foreignField:"_id",
          pipeline:[
            {
              $match:{
                $or:[
                  {chapter_number:Number(chapter_number)},
                  {"chapter_name.english" : chapter_number}
                 ]
              }
            }
          ],
          as:"chapterData"
        }
      },

      {
        $match:{
          chapterData:{$ne:[]}
        }
      },
      
      {
        $replaceRoot:{
          newRoot:{
          $first:"$chapterData"
          }
        }
      }
      
    
       
    ])

    if(!chapterId || !chapterId.length) return res.json({success:false, message:"class-name || subject-name || chapter-number is invalid"});

const data =  req.body.map((item)=>({...item, ["chapterId"]: chapterId[0]?._id, ["chapter_name"]:chapterId[0]?.chapter_name}));

const newLevelData = await levelModel.insertMany(data);
if(!newLevelData) return res.status(401).json({successLfalse, message:"Something went wrong"});

const levelId =  newLevelData.map((level)=> level?._id);
const updateChapter = await chapterModel.findByIdAndUpdate(chapterId[0]?._id,{
  $push:{
  level:{
    $each: levelId
  }
  }
},{new:true});  

res.json({success:true, result:newLevelData})

  }
catch(err){
  res.status(500).json({esuccess:false, message:"Server Error please try again later"})
}
 
    
    
}

module.exports = {getLevel,createLevel};