


const { classModel } = require("../schema/classSchema");
const{levelModel} = require("../schema/levelSchema");
const {questionModel} = require("../schema/questionSchema");

const getQuestion = async(req,res)=>{
    try{
    const { class_name, subject_name, chapter_number,level_number} =  req.params;

   
    const getQuestionData = await classModel.aggregate([
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
              pipeline:[
                {
                    $match:{
                      level_number:Number(level_number)
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
   
    
    if(!getQuestionData || !getQuestionData.length) return res.status(401).json("class_name || subject_name || chapter_number || level_name is invalid");
    res.json(getQuestionData);
}
catch(err){
    console.log(err)
}
}

// HERE THE CREATEQUETSION

const createQuestion = async(req,res)=>{

    try{
    

         
    const { class_name, subject_name, chapter_number,level_number} =  req.params;
   
    const levelId= await classModel.aggregate([
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
                        $or: [
                            {chapter_number: Number(chapter_number)},
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
              pipeline:[
                {
                    $match:{
                      level_number:Number(level_number)
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


const data = req.body.map((item)=>({...item, ["levelId"]:levelId[0]._id, ["level_number"]:levelId[0].level_number}));

const newQuetsionData  = await questionModel.insertMany(data);
res.json(newQuetsionData);


const questionId = newQuetsionData.map((question)=>question._id);

const updateLevel =await levelModel.findByIdAndUpdate(levelId[0]._id, {
    $push:{
        question:{
            $each:questionId
        }
    }
},{new:true});

    
}catch(err){
    console.log(err)
}


}


const deleteQuestion = async(req,res)=>{
    
    try{
      
       

        const levelmode = await levelModel.findByIdAndUpdate(req.body.levelId,{question:[]},{new:true})
        const deleteQuestionData = await  questionModel.deleteMany({_id:{$in:req.body.questionId}})
        console.log(levelModel)
        
         res.json(deleteQuestion)
    }
     catch(err){
 console.log("something wonrg", err)
     }
}

module.exports={getQuestion,createQuestion, deleteQuestion}