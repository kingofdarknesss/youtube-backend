import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  if (!content) {
    throw new ApiError(404, "Content is required");
  }

  const createTweet = await Tweet.create({
    content: content,
    owner: req.user._id,
  });

  const tweet = await Tweet.findById(createTweet._id);

  if (!tweet) {
    throw new ApiError(500, "Something went wrong while creating a tweet");
  }

  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const getuserTweets = asyncHandler(async (req, res) => {
      if (!userId) {
        throw new ApiError(404, "userId is required");
      }

      const tweets = await Tweet.find({
        owner: userId,
      }).select("-owner");

      if (!tweets) {
        throw new ApiError(500, "Something went wrong while getting tweets");
      }

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            tweets,
            `Got tweets Successfully for UserID: ${userId}`
          )
        );

  // TODO: get user tweets
  
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId) {
    throw new ApiError(404, "tweetId is required");
  }

  if (!content) {
    throw new ApiError(404, "content is required");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: content,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedTweet) {
    throw new ApiError(500, "Something went wrong while updating tweet");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTweet,
        `Updated the tweet successfully for tweetId: ${tweetId}`
      )
    );
  //TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
      const { tweetId } = req.params;

      if (!tweetId) {
        throw new ApiError(404, "tweetId is required");
      }

      const tweet = await Tweet.findByIdAndDelete(tweetId);

      await Like.deleteMany({ tweet: tweetId });

      if (!tweet) {
        throw new ApiError(404, "tweet id not found.");
      }

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            `Deleted the tweet successfully for tweetId: ${tweetId}`
          )
        );
  //TODO: delete tweet
});

export { createTweet, getuserTweets, updateTweet, deleteTweet };
