import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import {User} from "../models/user.js"
import { uploadfileOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiRespone.js";
const registerUser=asyncHandler(async (req,res)=>{
    // res.status(200).json({
    //     message:"User registered successfully"
    // })
    ///get user details from frontend
    // validations if not empty
    //check if user is already registered ,using email,username
    //check for image,check for avatar
    //upload image


    const {email,username,password,fullname}=req.body;
    console.log("email:",email);
    if (fullname===""){
        throw new ApiError("Full Name is required",400);
    }

    if (email === "") {
      throw new ApiError("Full Name is required", 400);
    }
      if (username === "") {
        throw new ApiError("Full Name is required", 400);
      }
      if (password === "") {
        throw new ApiError("Full Name is required", 400);
      }




      const exist= await User.findOne({
        $or :[{email},{username}]
      });
      if (exist){
        throw new ApiError("User already exists",400);
      }




      const avtarLocalPath=  req.files?.avtar[0]?.path;
      const coverImageLocalPath= req.files?.coverImage[0]?.path;
      if (!avtarLocalPath){
        throw new ApiError(400,"Avatar is required");
      }
      





      const avtar=await uploadfileOnCloudinary(avtarLocalPath);
      const coverImage=await uploadfileOnCloudinary(coverImageLocalPath);
      if (!avtar){
                throw new ApiError(400, "Avatar is required");

      }





      const user = await User.create({
        fullname,
        avtar: avtar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password,
      });

      



      const createdUser=await User.findOne(user._id).select("-password -refreshToken");

      if (!createdUser){
        throw new ApiError(500,"Something went wrong in server");
      }



      
      return res.status(201).json(new ApiResponse(200,createdUser,"User created successfully"))
})
export default registerUser;