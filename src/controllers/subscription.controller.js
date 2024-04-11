import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  if(!channelId){
    throw new ApiError(400,"channelId required")
  }
  
  const subscriber=await Subscription.find({channel:channelId,subscriber:req.user?._id})
  console.log(subscriber)

  if(subscriber.length===0){
    //subscribe the user
    const updatedSubscriber = await Subscription.create({
      channel: channelId,
      subscriber: req.user?._id,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedSubscriber,
          "subscription successfully created"
        )
      );

    
  } else {
    //the user is already subscriber so unsusbcribe him
    const updatedSubscriber = await Subscription.findOneAndDelete({
      channel: channelId,
      subscriber: req.user?._id,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedSubscriber,
          "subscription successfully deleted"
        )
      );
  }



    
  
  });

// controller to return subscriber list of a channel
const getuserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscribers=await Subscription.find({channel:channelId})
  if(subscribers.length===0){
    return res.status(200).json(new ApiResponse(200,subscribers,"this chnnael has zero subscribers"))
  }
      return res
        .status(200)
        .json(
          new ApiResponse(200, subscribers, "subscribers succesfully fetched")
        );

});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
    const channels = await Subscription.find({ subscriber: subscriberId });
    if (channels.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, channels, "this user has zero subscriptions")
        );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, channels, "channel subscriptions succesfully fetched")
      );
});

export { toggleSubscription, getuserChannelSubscribers, getSubscribedChannels };
