import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const dbconnect=async ()=>{
    try {
       const connectionData= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`Database Connected: ${connectionData.connection.host}`);
    } catch (error) {
        console.error(error);
        throw error;

    }
}
export default dbconnect;