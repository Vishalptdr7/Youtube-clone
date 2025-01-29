import mongoose from 'mongoose';

import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
      required: true,
      unique: true, // Ensure video URLs are unique
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


videoSchema.plugin(mongooseAggregatePaginate);

export const Video=mongoose.model('video',videoSchema);