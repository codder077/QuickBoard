const mongoose = require("mongoose");


const trainTicketSchema=mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    trainNo:{
        type:Number,
        // required:true
    },
    userEmail:{
        type:String,
        required:true
    },
    trainName:{
        type:String,
        required:true
    },
    departureStation:{
        type:String,
    },
   
    destinationStation:{
        type:String,
    },
   
    departuredate:{
        type:String,
    },
    midstation:{
        type:String,
    },
    // departuretime:{
    //     type:Number
    // },
    coach:{
        type:String
    },
    seatNo:{
        type:Number,
    },
    berth:{
        type:String
    },
    canceled:{
        type:Boolean
    },
    cancelationOnTrack:{
        type:Boolean
    },
    confirmed:{
        type:Boolean
    },
    waiting:{
        type:Boolean
    }
});

const TrainTicket=mongoose.model("TrainTicket",trainTicketSchema);
module.exports=TrainTicket;