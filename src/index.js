
import dotenv from 'dotenv';
import express from 'express';
import dbconnect from './db/index.js';
dbconnect();

dotenv.config({
    path:'./env'
});
const app=express();

/*

;(async()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",()=>{
            console.error("Failed to connect to MongoDB",error);
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);

        })
    } catch (error) {
        console.error(error);
        throw error;
    }
})()

    */