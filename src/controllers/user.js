import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.js";
import { Subscription } from "../models/subscription.js";
import { uploadfileOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import { verifyJWT } from "../middlewares/auth.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";







const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "User Not found!");
  }
};








const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //     message:"User registered successfully"
  // })
  ///get user details from frontend
  // validations if not empty
  //check if user is already registered ,using email,username
  //check for image,check for avatar
  //upload image

  const { email, username, password, fullname } = req.body;
  console.log("email:", email);
  if (fullname === "") {
    throw new ApiError(400, "Full Name is required");
  }

  if (email === "") {
    throw new ApiError(400, "Email is required");
  }
  if (username === "") {
    throw new ApiError(400, "Username is required");
  }
  if (password === "") {
    throw new ApiError(400, "Password is required");
  }

  const exist = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (exist) {
    throw new ApiError(400, "User already exists");
  }

  const avtarLocalPath = req.files?.avtar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avtarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avtar = await uploadfileOnCloudinary(avtarLocalPath);
  const coverImage = await uploadfileOnCloudinary(coverImageLocalPath);
  if (!avtar) {
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

  const createdUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong in server");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});








const loginUser = asyncHandler(async (req, res) => {
  /// req body ->data
  //username or email
  //find user
  //compare password
  //generate token
  //send token

  const { username, email, password } = req.body;
  console.log(username, email, password);
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }
  
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError("Invalid credentials", 401);
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  console.log(accessToken, refreshToken);
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedUser,
        refreshToken,
        accessToken,
        message: "Logged in successfully",
      })
    );
});





// const logoutUser = asyncHandler(async (req, res) => {
//   await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set: {
//         refreshToken: "",
//       },
//     },
//     { new: true }
//   );

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//   };

//   return res
//     .status(200)
//     .clearCookie("accessToken", options)
//     .clearCookie("refreshToken", options)
//     .json(new ApiResponse(200, {}, "User logged out"));
// });







const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});








const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshToken=req.cookies.refreshToken ||req.body.refreshToken;
  if (!incomingRefreshToken){
    throw new ApiError(401, "Refresh Token is required");
  };
  try {
    const decodedToken=jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user=await User.findById(decodedToken._id);
    if (!user){
      throw new ApiError(401, "Invalid Refresh Token");
    };
    
    if (incomingRefreshToken !==user.refreshToken ){
      throw new ApiError(401, "Refresh Token has expired");
    }
    const { accessToken, newrefreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    console.log(newrefreshToken)
    const loggedUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newrefreshToken, options)
     .json(
        new ApiResponse(200, {
          user: loggedUser,
          refreshToken:newrefreshToken,
          accessToken,
          message: "Logged in successfully",
        })
      );
  } catch (error) {
    throw new ApiError(error,"Refresh Token has expired");
  }
});







const changeCurrentPassword= asyncHandler(async (req,res)=>{
  const {currentPassword,newPassword,confirmPassword}=req.body;
  if (!currentPassword || !newPassword){
    throw new ApiError(400, "Current Password and New Password are required");
  };
  if (!(newPassword===confirmPassword)){
    throw new ApiError(400, "New Password and Confirm Password do not match");
  }
  const user=await User.findById(req.user?._id);
  if (!user){
    throw new ApiError(401, "User not found");
  }
  const isPasswordValid=await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid){
    throw new ApiError(401, "Invalid Current Password");
  }
  user.password=newPassword;
  await user.save({validateBeforeSave:false});
  return res.status(200).json(new ApiResponse(200,{},"Password Changed Successfully"))
})








const currentUser=asyncHandler(async(req,res)=>{
  

  return res.status(200).json(new ApiResponse(),req.user,"User Find Successfully")
});








const updateAccountDetails=asyncHandler(async(req,res)=>{
  const {fullname,email}=req.body;
  if(!fullname ||!email ){
    throw new ApiError(400, "Fullname, Email  are required");
  };
  const user=await User.findByIdAndUpdate(req.user._id,
    {
      $set:
      {fullname,
      email
    }
  },{new:true});
  return res
  .status(200)
  .json(new ApiResponse(200,user,"Successfully Updated Account Details"));
  
})








const updateUserAvtar= asyncHandler(async(req,res)=>{
  const avtarLocalPath=req.file?.path;
  if(!avtarLocalPath){
    throw new ApiError(400, "Avtar is required");
  };
  const avtar=await uploadfileOnCloudinary(avtarLocalPath);
  if (!avtar.url) {
    throw new ApiError(500, "Failed to upload avtar to cloudinary");
  }
  const user=await User.findByIdAndUpdate(req.user?._id,{
    $set:
    {
      avtar : avtar.url
    }
  },{new :true}).select("-password");
  return res.status(200).json(new ApiResponse(200,user,"Successfully Updated Account Details"));
});









const updateCoverImage=asyncHandler(async(req,res)=>{
  const coverImageLocalPath=req.file?.path;
  if (!coverImageLocalPath){
    throw new ApiError(400, "Cover Image is required");
  };
  const coverImage=await uploadfileOnCloudinary(coverImageLocalPath);
  if (!coverImage?.url) {
    throw new ApiError(500, "Failed to upload cover image to cloudinary");
  }
  if (!req.user?._id || !req.user){
    throw new ApiError(401, "User not found");
  }
  
  const user=await User.findByIdAndUpdate(req.user?._id, {
    $set:
    {
      coverImage : coverImage.url
    }
  },
    { new: true }).select("-password");

    if (!user){
      throw new ApiError(401, "User not found");
    }
    
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Successfully Updated Account Details"));
  }
  
  );






  // const getUserChannelProfile=asyncHandler(async(req,res)=>{
  //   const {username}= req.params;
  //   if (!username){
  //     throw new ApiError(400, "Username is required");
  //   }
  //   const channel = await User.aggregate([
  //     {
  //       $match: {
  //         username: username?.toLowerCase(),
  //       },
  //     },

  //     {
  //       $lookup: {
  //         from: "subscriptions",
  //         localField: "_id",
  //         foreignField: "channel",
  //         as: "subscribers",
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "subscriptions",
  //         localField: "_id",
  //         foreignField: "subscriber",
  //         as: "subscribedTo",
  //       },
  //     },
  //     {
  //       $addFields: {
  //         subscriberCount :{
  //           $size: "$subscribers",
  //         },
  //         channelSubscribedToCount :
  //         {
  //           $size: "$subscribedTo",
  //         },
  //         isSubscribed: {
  //           if :{
  //             $in: [req.user._id,"subscribers.subscriber"]
  //           },
  //           then :true,
  //           else :false
  //         }
  //       }
  //     },{
  //       $project: {
          
  //         username: 1,
  //         fullname: 1,
  //         avtar: 1,
  //         coverImage: 1,
  //         subscriberCount: 1,
  //         channelSubscribedToCount: 1,
  //         isSubscribed: 1,
  //       },
  //     }
      
  //   ]);
  //   if (!channel?.length){
  //     throw new ApiError(404, "Channel not found");
  //   };
  //   return res.status(200).json(new ApiResponse(200,channel[0],"User channel fetch successfully"))
  // })




  
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});









  const getWatchHistory=asyncHandler(async(req,res)=>{
    const user = await User.aggregate([{
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },

    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline:[{
          $lookup:{
            from: "user",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline:[{
              $project:{
                username:1,
                fullname:1,
                avtar:1
              }
            }]
          }
        }]
      },
    }
  ]);
  return res.status(200)
  .json(new ApiResponse(200,user[0].watchHistory,"Watch History Fetched Successfully"));
  })











export { registerUser, loginUser, logoutUser,refreshAccessToken,changeCurrentPassword,currentUser ,updateAccountDetails,updateCoverImage,updateUserAvtar,getUserChannelProfile,getWatchHistory};



