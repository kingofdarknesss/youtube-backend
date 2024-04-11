import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
    try {
      // Extract videoId from request parameters
      
      const videoExists = await Video.exists({ _id: videoId });
      if (!videoExists) {
        throw new ApiError(404, "Video does not exist");
      }

      if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
      }

     
      const existingLike = await Like.findOneAndDelete({
        video: videoId,
        likedBy: req.user._id,
      });

      if (existingLike) {
        
        return res
          .status(200)
          .json(new ApiResponse(200, null, "Video like deleted"));
      } else {
        
        const newLike = new Like({ video: videoId, likedBy: req.user._id });
        const savedLike = await newLike.save();
        return res
          .status(201)
          .json(new ApiResponse(201, savedLike, "Video liked "));
      }
    } catch (error) {
      console.error("Error while toggling video like:", error);
      throw new ApiError(500, "Error while toggling video like");
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
   const commentExists = await Comment.exists({ _id: commentId });
  if(!commentExists) {
    throw new ApiError(404, "Comment does not exist");
  }
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }
  try {
    const existingLike = await Like.findOneAndDelete({
      comment: commentId,
      likedBy: req.user._id,
    });

    if (existingLike) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Comment unliked successfully"));
    } else {
      const newLike = new Like({ comment: commentId, likedBy: req.user._id });
      const savedLike = await newLike.save();

      return res
        .status(201)
        .json(new ApiResponse(201, savedLike, "Comment liked successfully"));
    }
  } catch (error) {
    console.error("Error while toggling comment like:", error);
    throw new ApiError(500, "Error while toggling comment like");
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
    const tweetExists = await Tweet.exists({ _id: tweetId });
  if(!tweetExists) {
    throw new ApiError(404, "Tweet does not exist");
  }
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  try {
    const existingLike = await Like.findOneAndDelete({
      tweet: tweetId,
      likedBy: req.user._id,
    });

    if (existingLike) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Tweet unliked successfully"));
    } else {
      const newLike = new Like({ tweet: tweetId, likedBy: req.user._id });
      const savedLike = await newLike.save();

      return res
        .status(201)
        .json(new ApiResponse(201, savedLike, "Tweet liked successfully"));
    }
  } catch (error) {
    console.error("Error while toggling tweet like:", error);
    throw new ApiError(500, "Error while toggling tweet like");
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
