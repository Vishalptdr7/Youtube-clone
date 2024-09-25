import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});




const uploadfileOnCloudinary=async (localFilePath)=>{
    try{
        if (!localFilePath) return null;
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto" 

        })
        fs.unlinkSync(localFilePath);
        return response;
    }
    catch(error){

        //Remove the temporary file as the upload operation is failed
        fs.unlinkSync(
            localFilePath
        );


        return null;

    }
  };
  export {uploadfileOnCloudinary};