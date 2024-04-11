import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // TODO: create playlist
   if (
     [name, description].some((field) => field?.trim() === "")
   ) {
     throw new ApiError(400, "name and description fields are required");
   }
   const existedplaylist = await Playlist.findOne({
    name:name,
    description
     
   });
   console.log(existedplaylist)
   if (existedplaylist) {
     throw new ApiError(409, "playlist with same name and description already exists");
   }
   const playlist = await Playlist.create({
    name,
    description,
    owner:req.user?._id,
  
   
   });
   const createdPlaylist = await Playlist.findById(playlist._id)
   
    if (!createdPlaylist) {
      throw new ApiError(500, "soething went wrong while creating playlist");
    }
      return res
        .status(200)
        .json(new ApiResponse(200, createdPlaylist, "playlist created succesfully"));

});

const getuserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  if(!userId){
    throw new  ApiError(400,"user id is reuired for getting playlist")
  }
  const playlists=await Playlist.find({owner:userId})

  if(playlists.length==0){
    return res.status(200).json(new ApiResponse(200,playlists,"no playlists for now or something else went wrong"))
  }

    return res
      .status(200)
      .json(new ApiResponse(200, playlists, "succesfully fetched playlists"));
  

});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if(!playlistId){
    throw new ApiError(400,"playlist id is required")
  }
  const playlist=await Playlist.find({_id:playlistId})

  if(!playlist){
    throw new ApiError(400,"cannot fetch playlist or the playlist does not exist")
  }

  return res.status(200).json(new ApiResponse(200,playlist,"playlist found"))

});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if(!playlistId && !videoId ){
    throw new ApiError(400,"playlistId and videoId are required")
  }
  const existedPlaylist=await Playlist.find({_id:playlistId,videos:videoId})
  console.log(existedPlaylist)

  if(existedPlaylist.length!==0){
    throw new ApiError(400,"video already in playlist")
  }
  const updatedPlaylist=await Playlist.updateOne({_id:playlistId},{$push:{videos:videoId}})

  if(!updatePlaylist){
    throw new ApiError(400,"video cannot be added as eithrer does not exist")
  }
  return res.status(200).json(new ApiResponse(200,updatedPlaylist,"video successfully added"))
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
   if(!playlistId && !videoId ){
    throw new ApiError(400,"playlistId and videoId are required")
  }
  const existedPlaylist=await Playlist.find({_id:playlistId,videos:videoId})
  if(existedPlaylist.length==0){
    throw new ApiError(400,"video is not playlist")
  }
  const updatedPlaylist=await Playlist.updateOne({_id:playlistId},{$pull:{videos:videoId}})
  if(!updatedPlaylist){
    throw new ApiError(400,"video cannot be deletd as eithrer does not exist")
  }
  return res.status(200).json(new ApiResponse(200,updatedPlaylist,"video successfully removed"))





});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if(!playlistId){
    throw new ApiError(400,"playlist id required")
  }
  const deletdPlaylist=await Playlist.findByIdAndDelete({_id:playlistId})

  if(!deletdPlaylist){
    throw new ApiError(500,"cannot deletd playlist")
  }
    return res
      .status(200)
      .json(
        new ApiResponse(200, deletdPlaylist, "playlist successfully delted")
      );
      

  
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  //  if ([name, description].some((field) => field?.trim() === "")) {
  //    throw new ApiError(400, "name and description fields are required");
  //  }
    if (!playlistId) {
      throw new ApiError(400, "playlist id required");
    }
    const updatedplaylist=await Playlist.findByIdAndUpdate(playlistId,{$set:{name,description}},{new:true})
     if (!updatedplaylist) {
       throw new ApiError(
         400,
         "playlist cannot be updated"
       );
     }
     return res
       .status(200)
       .json(
         new ApiResponse(200, updatedplaylist, "play list updated")
       );




});

export {
  createPlaylist,
  getuserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
