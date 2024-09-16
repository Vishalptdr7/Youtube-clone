import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';



const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        minlength:3,
        maxlength:20
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: {
            validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            message: 'Please enter a valid email address.'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    fullname:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50
    },
    avtar:{
        type:String,
        default:'default.jpg',
        required:true
    },
    coverImage:{
        type:String,
        default:'cover.jpg'
    },
    refreshToken:{
        type:String,
        default:null
    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref:'video'
    }

},{timestamps:true});

userSchema.pre('save',async function(next){
    if (!this.isModified('password') ) return next();
    this.password=bcrypt.hash(this.password,10);
});

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);

};

userSchema.methods.generateRefreshToken=async function(){
    return await jwt.sign({
        id:this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        process.env.REFRESH_TOKEN_EXPPIRY
    );
};

userSchema.methods.generateAccessToken=async function(){
    return await jwt.sign({
        id:this._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_EXPIRY);
};

export const connection=mongoose.model('user',userSchema);
