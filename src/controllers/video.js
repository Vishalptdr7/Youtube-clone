import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Video } from "../models/video.js";

import { uploadfileOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.js";
import mongoose from "mongoose";

// Fetch all videos with pagination, filters, and sorting

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;


  //TODO: get all videos based on query, sort, pagination
});

// const publishVideo = asyncHandler(async (req, res) => {
//   const { title, description, duration } = req.body;

//   // Validate required fields
//   if (!title) {
//     throw new ApiError(400, "Title is required");
//   }
//   if (!description) {
//     throw new ApiError(400, "Description is required");
//   }
//   if (!duration) {
//     throw new ApiError(400, "Duration is required");
//   }
//   console.log("Description, duration,title");
  
//   // Process and validate thumbnail


//  // This drops the unique index on the video field

//   // Process and validate video file
//   const videoLocalPath = req.files?.videoUrl?.[0]?.path;
//   if (!videoLocalPath) {
//     throw new ApiError(400, "Video file is required");
//   }

//   // Upload video file to Cloudinary
//   const videoUrl = await uploadfileOnCloudinary(videoLocalPath);
//   if (!videoUrl) {
//     throw new ApiError(500, "Failed to upload video to Cloudinary");
//   }

//   // Retrieve the user
//   const user = await User.findById(req.user._id);
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   // Create video document
//   const video = new Video({
//     videoUrl: videoUrl.url,
//     title,
//     thumbnail: thumbnail.url,
//     description,
//     duration,
//     owner: req.user._id,
//     isPublished: true, // Mark video as published
//   });

//   const savedVideo = await video.save();

//   res.status(201).json({
//     message: "Video published successfully",
//     video: savedVideo,
//   });

//   // TODO: get video, upload to cloudinary, create video
// });


const publishVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;

  if (!title || !description || !duration) {
    throw new ApiError(400, "All fields are required");
  }

  const videoLocalPath = req.files?.videoUrl?.[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  const videoUrl = await uploadfileOnCloudinary(videoLocalPath);
  if (!videoUrl) {
    throw new ApiError(500, "Failed to upload video to Cloudinary");
  }


    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail is required");
    }

    // Upload thumbnail to Cloudinary
    const thumbnail = await uploadfileOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
      throw new ApiError(500, "Failed to upload thumbnail to Cloudinary");
    }

  const video = new Video({
    videoUrl: videoUrl.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration,
    owner: req.user._id,
    isPublished: true,
  });

  const savedVideo = await video.save();

  return res.status(201).json({
    message: "Video published successfully",
    video: savedVideo,
  });
});






const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Validate the videoId format
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID format");
  }

  // Fetch the video from the database
  const video = await Video.findById(videoId).populate("owner", "name email");
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Return the video details
 return  res.status(200).json({
    success: true,
    message: "Video retrieved successfully",
    video,
  });
});


const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});


export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
