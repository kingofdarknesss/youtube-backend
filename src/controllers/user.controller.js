import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApirResponse.js";
import  cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken=async (userId)=>{
    try {
        const User=await user.findById(userId)
        
        const accessToken=User.generateAccessToken()
        

        const refreshToken=User.generateRefreshToken()
        


        User.refreshToken=refreshToken;
      

        await User.save({validateBeforeSave:false})
        


        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"something went wrong while gnerating token")
        
    }
}








const registerUser = asyncHandler(async (req, res) => {

  //get user detail
  //validation
  //vheck if already exist:usename and email
  //check if avatar and coverimage
  //upload them cloudinary,avatar
  //create user object-create entry in db
  //remove password  and refresh token field from response
  //check for user creation
  //return res

  const { fullName, userName, email, password } = req.body;
//   console.log(email);
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required");
  }


  const existedUser = await user.findOne({
    $or: [{ userName }, { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "user with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
//   const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0 ){
    coverImageLocalPath = req.files?.coverImage[0]?.path;

  }





  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "avatar is required");
  }

  const User = await user.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await user
    .findById(User._id)
    .select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "soething went wrong while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registred succesfully"));
});


const loginUser=asyncHandler(async (req,res)=>{
    //req body-> data
    //username and email
    //find the user
    //password check
    //access and refresh token
    //send cookie
    const {email,userName,password}=req.body

    if(!(userName || email)){
        throw new ApiError(400,"userName or email is required")
    }

    const User=await user.findOne({$or:[{userName},{email}]})

    if(!User){
        throw new ApiError(404,"user not found")
    }

   const isPasswordValid= await User.isPasswordCorrect(password)

   if(!isPasswordValid){
        throw new ApiError(401,"incorrect password")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(User._id)

    const loggedInUser=await user.findById(User._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
        200,
        {
          User:loggedInUser,refreshToken,accessToken
        },
       
        "user logged in successfully"
        )
    )
})


const logoutUser=asyncHandler(async (req,res)=>{
    await user.findByIdAndUpdate(req.User._id,{
        $set:{
            refreshToken:undefined
        }
        ,
    },{
        new:true
    })

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .json(new ApiResponse(200,{},"user logged out"))

})


const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshToken=req.cookies.refreshAccessToken || req.body.refreshAccessToken

  if(!incomingRefreshToken){
    throw new ApiError(401,"unauthorized request")
  }

try {
    const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    const User=await user.findById(decodedToken?._id)
  
    if(!User){
      throw new ApiError(401,"invalid refresh token")
    }
    if(incomingRefreshToken!==User?.refreshToken){
      throw new ApiError(401,"invalif refresh token or expired")
    }
  
    const options={
      httpOnly:true,
      secure:true
    }
    const {accessToken,newRefreshToken }=await generateAccessAndRefreshToken(User?._id)
  
    return res
      .status(200)
      .cookie("access token", accessToken, options)
      .cookie("refresh token", newRefreshToken, options)
      .json(new ApiResponse(200,{accessToken,refreshToken:newRefreshToken},"tokens refreshed"))
} catch (error) {
  throw new ApiError(401,error?.message || "invalif refresh token")
  
}











})

export { registerUser,loginUser,logoutUser,refreshAccessToken };
