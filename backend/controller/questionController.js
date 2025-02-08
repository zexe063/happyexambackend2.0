


const { classModel } = require("../schema/classSchema");
const{levelModel} = require("../schema/levelSchema");
const {questionModel} = require("../schema/questionSchema");

const getQuestion = async(req,res)=>{
    const { class_name, subject_name, chapter_number,level_name} =  req.params;

   
    const getQuestionData = await classModel.aggregate([
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
              pipeline:[
                {
                    $match:{
                      level_name:level_name
                    }
                }
              ],
              as:"levelData"
            }
        },
        {
            $lookup:{
                from:"questions",
                localField:"levelData.question",
               foreignField:"_id",
               as:"questionData"

            }
        },
        {
            $match:{
                quetsionData: {$ne:[]}
            }
        },
       
        {
    $unwind:"$questionData"
        },
        {
            $replaceRoot:{
              newRoot:"$questionData"
              
            }
          }
          
      

      
       
    ])
    
    if(!getQuestionData || !getQuestionData) return res.status(401).json("class_name || subject_name || chapter_number || level_name is invalid");
    res.json(getQuestionData);
}

const createQuestion = async(req,res)=>{
    const { class_name, subject_name, chapter_number,level_name} =  req.params;
   
    const levelId= await classModel.aggregate([
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
            $lookup:{
                 from:"levels",
                 localField:"chapterData.level",
              foreignField:"_id",
              pipeline:[
                {
                    $match:{
                      level_name:level_name
                    }
                }
              ],
              as:"levelData"
            }
        },

        {
            $match:{
                levelData :{$ne:[]}
            }
        },
        {
            $project:{
                levelId:0
            }
        },
        {
            $replaceRoot:{
                newRoot:{
                    $first:"$levelData"
                }
            }
        }
    ])
    if(!levelId || !levelId.length) return res.status(401).json("class_name || subject_name || chapter_number || level_name is invalid");


const data = req.body.map((item)=>({...item, ["levelId"]:levelId[0]._id, ["level_name"]:levelId[0].level_name}));

const newQuetsionData  = await questionModel.insertMany(data);
res.json(newQuetsionData);

const questionId = newQuetsionData.map((question)=>question._id);
console.log(questionId)
const updateLevel =await levelModel.findByIdAndUpdate(levelId[0]._id, {
    $push:{
        question:{
            $each:questionId
        }
    }
},{new:true});
console.log(updateLevel);


}

module.exports={getQuestion,createQuestion}