


const { classModel } = require("../schema/classSchema");
const {levelModel} = require("../schema/levelSchema");
const {chapterModel} = require("../schema/chapterSchema");




const getLevel = async(req,res)=>{
  const   {class_name, subject_name, chapter_number} =  req.params;

  try{
    const  {class_name, subject_name, chapter_number} =  req.params;


    console.log(class_name,subject_name,chapter_number)
    const getLevelData =   await classModel.aggregate([
      
      {
        $match:{
          class_name:class_name
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
              "chapter_name.english":chapter_number
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

    if(!getLevelData || !getLevelData.length) return res.status(401).json("class_name || subject_name || chapter_number is invalid")
      res.json(getLevelData);

}
catch(err){
 res.status(401).json(err)
}

}



const  createLevel  =   async(req,res)=>{
    
  try{
    const  {class_name, subject_name, chapter_number} =  req.params;

 
    const chapterId =   await classModel.aggregate([
      
      {
        $match:{
          class_name:class_name
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
              chapter_number:chapter_number
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

    if(!chapterId || !chapterId.length) return res.json("class_name || subject_name || chapter_number is invalid");

const data =  req.body.map((item)=>({...item, ["chapterId"]: chapterId[0]._id, ["chapter_name"]:chapterId[0].chapter_name}));

const newLevelData = await levelModel.insertMany(data);
res.json(newLevelData);
const levelId =  newLevelData.map((level)=> level._id);

const updateChapter = await chapterModel.findByIdAndUpdate(chapterId[0]._id,{
  $push:{
  level:{
    $each: levelId
  }
  }
},{new:true});  

console.log(updateChapter)
  }
catch(err){
 res.status(401).json(err)
}
 
    
    
}

module.exports = {getLevel,createLevel};