import mongoose,{Schema}   from "mongoose";

const subscriptionSchema=new mongoose.Schema({
    subscriber:{

        type:mongoose.Schema.Types.ObjectId,
        //type:Schema.Types.ObjectId
        ref:'user',
        required:true
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }


},{timestamps:true});