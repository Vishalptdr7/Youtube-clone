import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(cookieParser({
    httpOnly:true
    // Only allow the cookies to be accessed via HTTP requests, not through JavaScript
}));
app.use(express.urlencoded({extended:true}));     //  when the url come from server then it contains adding of two varibale 
app.use(express.static("public"));   /// you can store the the static file in public folder that is image etc.

app.use(express.json());
import userRouter from "./routes/user.js";

app.use('/api/users',userRouter);


export {app};