import mongoose from "mongoose";

const WaitingListSchema=new mongoose.schema({
    pnr:{
        type:String,
    },
    alloted:{
        type:boolean,
        default:false
    },
    cancelled:{
        type:boolean,
        default:false
    }

})
const TrainDataSchema=new mongoose.Schema({
    trainNo:{
        type:Number
    },
    trainName:{
        type:String
    },
    totalSeats:{
        type:Number
    },
    availableSeats:{
        type:Number
    },
    waitingNo:{
        type:Number,
    },
    waitings:[WaitingListSchema]
        

})
const DataRecordSchema=new mongoose.schema({
    date:{
        type:String
    },
    trainRecord:[TrainDataSchema]
})
const SetsRecordSchema=new mongoose.Schema({
    sets:[DataRecordSchema]
});

const SetsRecord=mongoose.model("SetsRecord",SetsRecordSchema);
module.exports=SetsRecord;