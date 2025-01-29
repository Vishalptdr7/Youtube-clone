import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Video } from "../models/video.js";


const searchInSearchBar=asyncHandler(async(req,res)=>{
    try {
    const { searchText } = req.query;

    if (!searchText) {
        return res.status(400).json({ message: "Search text is required." });
    }

    const videos = await Video.find({
        $or: [
        { title: { $regex: searchText, $options: "i" } },
        { description: { $regex: searchText, $options: "i" } },
        { owner: { $regex: searchText, $options: "i" } }, 
        ],
    });

    if (videos.length === 0) {
        return res.status(404).json({ message: "No videos found." });
    }

    res.status(200).json(videos);
    } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
    }
})

export {searchInSearchBar};