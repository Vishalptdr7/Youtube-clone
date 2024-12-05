import mongoose,{Schema} from "mongoose";

const likeSchema=new mongoose.Schema({
comment:{
    type:Schema.Types.ObjectId,
    ref:'Comment',
    required:true
},
videos:{
    type:Schema.Types.ObjectId,
    ref:'Video',
    required:true
},
likedBy:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
},
tweets:{
    type:Schema.Types.ObjectId,
    ref:'Tweet',
    required:false
}
},{timestamps:true});


export const Like=mongoose.model('like',likeSchema);