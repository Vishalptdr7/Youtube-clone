
import dotenv from 'dotenv';
import {app} from './app.js'
import dbconnect from './db/index.js';
dbconnect().then(()=>{
    console.log("Database Connected Successfully");
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });
 
}).catch((err)=>{
    console.log(err);
});

dotenv.config({
    path:'./env'
});



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