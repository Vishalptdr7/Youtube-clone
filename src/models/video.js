import mongoose from 'mongoose';

import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const videoSchema=new mongoose.Schema({
    videoUrl:{
        type:String,
        required:true,
        unique:true,

    },
    title:{
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    
    views:{
        type:Number,
        default:0,
    },
    duration:{
        type:String,
        required:true,
    },
    isPublished:{
        type:Boolean,
        default:false,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true,
    }

},{timestamps:true});

videoSchema.plugin(mongooseAggregatePaginate)

export const connection=mongoose.model('video',videoSchema);