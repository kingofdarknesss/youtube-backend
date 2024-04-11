import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination

});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if (
    [title,description].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required");
  }



  const videoLocalPath = req.files?.videoFile[0]?.path;
  //   const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // let coverImageLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files?.coverImage[0]?.path;
  // }
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "video required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!videoFile) {
    throw new ApiError(400, "video is required");
  }

  const video = await Video.create({
    videoFile:videoFile.url,
    thumbnail: thumbnail.url,
     
    title,
    description,
    duration:videofile?.duration,
    
    owner:req.user._id
    
  });

  const createdVideo = await Video.findById(video._id)

  if (!createdVideo) {
    throw new ApiError(500, "soething went wrong while uploading video");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdVideo, "video uploaded succesfully"));

});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if(!isValidObjectId(videoId)){
    throw new ApiError(500,"video id not valid")
  }
  const currentVideo=await Video.findById(videoId)
  if(!currentVideo){
    throw new ApiError(400,"cannot get video either an internal isue or the video does not exist")
  }
  return res.status(200).json(new ApiResponse(200,currentVideo,"video fetched successfully"))

});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  
  
  if (!isValidObjectId(videoId)) {
    throw new ApiError(500, "video id not valid");
  }
  //TODO: update video details like title, description, thumbnail
  const {title,description} = req.body;
  const thumbnailLocalPath=req.file?.path
   if (!thumbnailLocalPath) {
     throw new ApiError(400, "details required");
   }

    const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);
  if(!thumbnailFile)
  {
    throw new ApiError(400,"file not uploaded")
  }

   const updatedVideo=await Video.findByIdAndUpdate(videoId,{
    $set:{
      title,description,thumbnail:thumbnailFile.url
    }
   },{
      new:true
    })
    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "video updated successfully"));

});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if(!isValidObjectId(videoId)){
    throw new ApiError(500,"not valid video id")
  }
  const deletedVideo=await Video.findByIdAndDelete(videoId)

  if(!deleteVideo){
    throw new ApiError(500,"thr problem is ours side video not deleted")
  }

  return res.status(200).json(new ApiResponse(200,deletedVideo,"video succesfully deleted"))
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
   if (!isValidObjectId(videoId)) {
     throw new ApiError(400, "Invalid video id");
   }

   const videoOwner = await Video.findById(videoId).select("owner");
   if (!videoOwner || videoOwner.owner.toString() !== userId.toString()) {
     throw new ApiError(
       403,
       "Video Not found || You are not owner of this video"
     );
   }

   // Find the video by its ID
   const video = await Video.findById(videoId).select("-owner");

   if (!video) {
     throw new ApiError(404, "Video not found");
   }

   // Toggle the isPublished status
   video.isPublished = !video.isPublished;

   // Save the updated video document
   const updatedVideo = await video.save();

   return res
     .status(200)
     .json(new ApiResponse(200, updatedVideo, "Video publish status updated"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
