


const  {chapterModel} = require("../schema/chapterSchema");
const { classModel } = require("../schema/classSchema");
const { subjectModel } = require("../schema/subjectSchema");


const getChapter = async(req,res)=>{
    try{
    const {class_name, subject_name} = req.params;
    const getChapterData = await classModel.aggregate([
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
               as:"chapterData"
            }
        },
         
        {
            $match:{
                chapterData:{$ne:[]}
            }
        },

        {
            $project:{
                
                "chapterData.level":0,
                
            }
        },
        {
            $unwind: "$chapterData"
        },
        {
            $replaceRoot:{
                newRoot:"$chapterData"
            }
           }
        
        
    ])

    if(!getChapterData || !getChapterData.length) return res.status(401).json({success:false, message: "class || subject is invalid"});

    res.json({success:true, result:getChapterData})

    }
    catch(err){
   res.status(500).json({success:false, message:"Server Error please try again later"})
    }


}





const createChapter =async(req,res)=>{
const{class_name, subject_name} = req.params;
 
try{
    const subjectId =  await classModel.aggregate([

        {
            $match:{
                 class_name: Number(class_name)
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
                            "subject_name.english" : subject_name
                        }
                    }
                ],
                 as: "subjectData"
            }
        },
    
      
       
    
        {
            $match : {
              subjectData:{$ne:[]}
            }
          },
      
          {
            $replaceRoot:{
              newRoot:{
                  $first:"$subjectData"
              }
            }
          }
        
        
     ]);
 

     
    
    if(!subjectId || !subjectId.length) return res.json({success:false, message:" class || subject is invalid"}) 
       
     const data = req.body.map((item)=>({...item, ["subjectId"]:subjectId[0]?._id, ["subject_name"]:subjectId[0]?.subject_name}));

     const newchapterData  = await chapterModel.insertMany(data);
      if(!newchapterData) return res.status(401).json({success:false, result:newchapterData});

     const chapterId = newchapterData.map((chapter)=>chapter._id);
     const updateSubject = await subjectModel.findByIdAndUpdate(subjectId[0]._id,{
        $push:{
            chapter:{
           $each:chapterId
            }
        }
     },{new:true});
      res.json({success:true, result:newchapterData});

}
catch(err){
    res.status(500).json({success:false, message:"Server Error please try again later"})
}

}

module.exports = {getChapter, createChapter}