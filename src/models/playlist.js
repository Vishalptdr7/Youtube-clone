import mongoose,{Schema} from "mongoose";

const playlistSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    videos:
        [{
            type:Schema.Types.ObjectId,
            ref:'Video',
            required:true

        }],
        owner:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
},{timestamps:true});

export const Playlist=mongoose.model('playlist',playlistSchema);