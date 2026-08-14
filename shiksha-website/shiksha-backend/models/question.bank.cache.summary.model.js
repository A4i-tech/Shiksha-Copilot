const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const objectiveSchema = new Schema(
    {
      objective: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    },
    { _id: false }
  )

const questionDistributionSchema = new Schema(
    {
      unitName:{
        type:String
      },
      objective:{
        type: objectiveSchema
      }
    }
  )
  
  const templateSchema = new Schema(
    {
      type:{
        type:String
      },
      numberOfQuestions:{
        type:Number
      },
      marksPerQuestion:{
        type:Number
      },
      questionDistribution:[questionDistributionSchema]
    }
  )

  const questionsSchema = new Schema({
    type:{
      type:String
    },
    numberOfQuestions:{
      type:Number
    },
    marksPerQuestion:{
      type:Number
    },
    questions:[{ type: Schema.Types.Mixed }]
  });
  

const questionBankCacheSummarySchema = new Schema({
    questionBankConfigId:{
        type: ObjectId,
        ref: "QuestionBankConfiguration",
    },
    totalQuestionsToFindInCache:{
        type:Number
    },
    cacheHit:{
        type:Number
    },
    cacheMiss:{
        type:Number
    },
    notFoundQuestions:{
      type:[templateSchema],
      default:undefined
    },
    notFoundResponse:{
      type:[questionsSchema],
      default:undefined
    },
    aiQuestionsForCache:{
      type:[questionsSchema],
      default:undefined
    },
    inProgress:{
      type:Boolean,
      default:false
  },
    processedCache:{
      type:[{ type: Schema.Types.Mixed }],
      default:undefined
    },
    isCacheUpdated:{
        type:Boolean,
        default:false
    },
    unitLevel:{type:String}
},
{
  timestamps:true,
  minimize:true
})

const QuestionBankCacheSummary = mongoose.model("QuestionBankCacheSummary",questionBankCacheSummarySchema);

module.exports = QuestionBankCacheSummary;
