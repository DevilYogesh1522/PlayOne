import { asynchandler } from "../utils/Asynchandler.js";
import {APIError } from "../utils/Apierror.js"
import { user } from "../models/user.model.js";
import {uploadOnLCloudinary} from "../utils/cloudinary.js"
import { APIresponse } from "../utils/Apiresponse.js";

const registeruser = asynchandler(async (req, res) => {
 // get user details from frontend
 //validation-not empty\
 //check if user already exists
 //:-check using username and email
 //check for images ,check for coverimages
 //uploaded them on cloudinary,avatar
 //create user  object - create entry in db
 //remove password amd refresh token filed from response
 //check for user creation
 //return rersponse

 const {fullname,email,username,password}=req.body
 console.log("email :",email)
  if(
    [fullname,email,username,password].some((field)=>field?.trim==="")
        
    
  ){
     throw new APIError(400,"All Fields Are Required !")
  }
  const existedUser=user.findOne({
    $or:[{username},{email}]
  })

  if(existedUser){
    throw new APIError(409,"Username Or Email Already exists")
  }
 //multer provides the access to the files that we want to upload.
  const avatarLocalpath=req.files?.avatar[0]?.path;
  const coverimagelocalpath=req.files?.coverimage[0]?.path;

  if(!avatarLocalpath){
    throw new APIError(400,"Avatar is required..")
  }

   const avatar=await uploadOnLCloudinary(avatarLocalpath);
   const coverImage= await uploadOnLCloudinary(coverimagelocalpath)

   if(!avatar){
    throw new APIError(400,"Avatar is Required ")
   }

    const User=await user.create({
        fullname,
        email,
        avatar:avatar.url,
        coverimage:coverImage?.url || "",
        password,
        username:username.toLowerCase()
    })

    const createduser=await user.findById(User._id).select(
        "-password -refreshtoken"
    )

    if(!createduser){
        throw new APIError(500,"Something Went Wrong While Registering The User..")
    }
        
     return res.status(201).json(
        new APIresponse(200,createduser,"User Registered Successfully !")
     )
});

export { registeruser };
