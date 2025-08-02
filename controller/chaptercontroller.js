


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




    if(!getChapterData || !getChapterData.length) return res.status(401).json("class || subject is invalid");

    res.json(getChapterData)

    }
    catch(err){
  res.status(401).json(err)
    }


}





const createChapter =async(req,res)=>{
const{class_name, subject_name} = req.params;
console.log(class_name,subject_name)
 
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
 

     
    
    if(!subjectId || !subjectId.length) return res.json(" class  || subject is invalid") 
       
     const data = req.body.map((item)=>({...item, ["subjectId"]:subjectId[0]._id, ["subject_name"]:subjectId[0].subject_name}));

     const newchapterData  = await chapterModel.insertMany(data);
     res.json(newchapterData);
     const chapterId = newchapterData.map((chapter)=>chapter._id);
   
    
     const updateSubject = await subjectModel.findByIdAndUpdate(subjectId[0]._id,{
        $push:{
            chapter:{
           $each:chapterId
            }
        }
     },{new:true});
    

}
catch(err){
    console.log(err);
}


 
 


}

module.exports = {getChapter, createChapter}