import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import {user} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApirResponse.js";
const registerUser= asyncHandler(async (req,res)=>{

    //get user detail
    //validation
    //vheck if already exist:usename and email
    //check if avatar and coverimage
    //upload them cloudinary,avatar
    //create user object-create entry in db
    //remove password  and refresh token field from response
    //check for user creation
    //return res

   const {fullName,userName,email,password}= req.body
   console.log(email)
    if ([fullName,email,userName,password].some((field)=>field?.trim()==="")) {
            throw new ApiError(400,"all fields are required")

        }
       const existedUser= user.findOne({
            $or:[{userName},{email}]
        })
        if(existedUser){
            throw new ApiError(409,"user with email or username already exists")
        }

       const avatarLocalPath= req.files?.avatar[0]?.path
       const coverImageLocalPath=req.files?.coverImage[0]?.path

       if(!avatarLocalPath){
        throw new ApiError(400,"avatar required")
       }
       
       
       const avatar=await uploadOnCloudinary(avatarLocalPath)
       const coverImage=await uploadOnCloudinary(coverImageLocalPath)
       if(!avatar){
        throw new ApiError(400,"avatar is required")
       }

       const User =await user.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        userName:userName.toLowerCase()

       })

       const createdUser=await user.findById(_id).select("-password -refreshToken")


       if(!createdUser){
        throw new ApiError(500,"soething went wrong while creating user")
       }

       return res.status(201).json(
        new ApiResponse(200,createdUser,"user registred succesfully")
       )

})

export {registerUser}