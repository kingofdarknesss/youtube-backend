import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }

    try {
      const newComment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
      });

      return res
        .status(201)
        .json(new ApiResponse(201, newComment, "Comment added successfully"));
    } catch (error) {
      console.error("Error while adding comment:", error);
      throw new ApiError(500, "Error while adding comment");
    }
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
    const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user?._id;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const commentOwner = await Comment.findById(commentId).select("owner");
  if (commentOwner.owner.toString() !== userId.toString()) {
    console.log("You are not authorized to update this comment ");
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: { content },
      },
      { new: true }
    );
    if (!updatedComment) {
      throw new ApiError(404, "Comment not found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
      );
  } catch (error) {
    console.error("Error while updating comment:", error);
    throw new ApiError(500, "Error while updating comment");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
   const { commentId } = req.params;
   if (!mongoose.isValidObjectId(commentId)) {
     throw new ApiError(400, "Invalid comment id");
   }

   const commentOwner = await Comment.findById(commentId).select("owner");
   if (commentOwner.owner.toString() !== userId.toString()) {
     console.log("You are not authorized to delete this comment ");
     throw new ApiError(403, "You are not authorized to delete this comment");
   }

   try {
     await Like.deleteMany({ comment: commentId });
     const deletedComment = await Comment.findByIdAndDelete(commentId);
     if (!deletedComment) {
       throw new ApiError(404, "Comment not found");
     }
     return res
       .status(200)
       .json(new ApiResponse(200, null, "Comment deleted successfully"));
   } catch (error) {
     console.error("Error while deleting comment:", error);
     throw new ApiError(500, "Error while deleting comment");
   }
});

export { getVideoComments, addComment, updateComment, deleteComment };
