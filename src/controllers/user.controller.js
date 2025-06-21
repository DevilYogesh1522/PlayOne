import { asynchandler } from "../utils/Asynchandler.js";
import {APIError } from "../utils/Apierror.js"
import { user } from "../models/user.model.js";
import {uploadOnLCloudinary} from "../utils/cloudinary.js"
import { APIresponse } from "../utils/Apiresponse.js";

const genraterefreshandaccesstoken=async(userId)=>{
  try {
        const User=await user.findById(userId)
        const accesstoken=User.generateAccessToken
        const refreshtoken=User.generateRefreshtoken

        User.refreshtoken=refreshtoken
      await  User.save({validateBeforeSave:false})
       
       return {accesstoken,refreshtoken}
    } catch (error) {
    throw new APIError(500,"Something went wrong while generating refresh and access token")
  }
}


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
  const existedUser=await user.findOne({
    $or:[{username},{email}]
  })

  if(existedUser){
    throw new APIError(409,"Username Or Email Already exists")
  }
 //multer provides the access to the files that we want to upload.
  const avatarLocalpath=req.files?.avatar[0]?.path;
  // const coverimagelocalpath=req.files?.coverimage[0]?.path;

    let coverimagelocalpath;

    if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0){
        coverimagelocalpath = req.files.coverimage[0].path
    }

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
        new APIresponse(200,createduser,"User Registered Successfully !`")
     )
});

const loginuser=asynchandler(async(req,res)=>{
  const {fullname,email,password}=req.body

  if(!fullname || !email){
    throw new APIError(400,"username or email id required")
  }

  const User=await user.findOne({
    $or:[{fullname},{email}]
  })

  if(!User){
    throw new APIError(404,"User does not exits")
  }

  const ispasswordvalid=await User.isPasswordCorrect(password)
  if(!ispasswordvalid){
       throw new APIError(401,"Invalid  user credientials")
  }
        
     const {accesstoken,refreshtoken}=await genraterefreshandaccesstoken(User._id)
     const loggedinuser=await User.findById(User._id).select("-password -refreshtoken")

     const options={
      httpOnly:true,
      secure:true
     }

     return res
     .status(200)
     .cookie("accesstoken",accesstoken,options)
     .cookie("refreshtoken",refreshtoken,options)
     .json(
      new APIresponse(200,
        {
          user:loggedinuser,refreshtoken,accesstoken
        },
        "user logged in successfully"
      )
     )
})


const logoutuser = asynchandler(async(req,res)=>{
     await user.findByIdAndUpdate(
              req.user._id,
              {
                $set:{refreshtoken:undefined}
              },
              {
                new :true
              }
       )

       const options={
        httpOnly:true,
        secure:true
       }
       return res.status(200)
       .clearCookie("accesstoken",options)
       .clearCookie("refreshtoken",options)
       .json(new APIresponse(200,{},"user loggedout successfully"))
})

const changecurrentpassword =asynchandler(async(req,res)=>{
   
    const{oldpassword,newpassword}=req.body
    const User=await user.findById(req.user?._id)

   const ispasswordvalid= await User.isPasswordCorrect(oldpassword)
   if(!ispasswordvalid){
    throw new APIError(400,"Invalid old password")
   }

   User.password=newpassword;
   await User.save({validateBeforeSave:false})

   return res
   .status(200)
   .json(new APIresponse(200,{},"password changed successfully"))

})

const updateaccountdetails=asynchandler(async(req,res)=>{

  const {fullname,email}=req.body

  if(!fullname || !email){
    throw new APIError(400,"All fields are required")
  }

  const User=user.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        fullname,
        email
      }
    },
    {
      new:true
    }
  ).select("-password")
 
   return res
   .status(200)
   .json(new APIresponse(200,User,"Account details updated successfully"))
})
const getcurrentuser=asynchandler(async(req,res)=>{
    return res
    .status(200)
    .json(200,req.user,"current user fetched successfully")
  })

const updateuseravatar =asynchandler(async(req,res)=>{
      const avatarlocalfile=req.file?.path

      if(avatarlocalfile){
        throw new APIError(400,"Avatar file is missing")
      }

      const avatar =await uploadOnLCloudinary(avatarlocalfile)
          
      if(!avatar.url){
        throw new APIError(400,"Error while uploading on avatar")
      }

     const User= await user.findByIdAndUpdate(
        req.User._id,
        { 
          $set:{
            avatar:avatar.url
          }
        },
        {new:true}
      )
         
       return res
      .status(200)
      .json(new APIresponse(200,User,"avatar updated successfully"))

    })
const updateusercoverimage =asynchandler(async(req,res)=>{
      const coverimagepath=req.file?.path

      if(coverimagepath){
        throw new APIError(400,"coverimage file is missing")
      }

      const coverimage =await uploadOnLCloudinary(coverimagepath)
          
      if(!coverimage.url){
        throw new APIError(400,"Error while uploading on coverimage")
      }

     const User= await user.findByIdAndUpdate(
        req.User._id,
        { 
          $set:{
            coverimage:coverimage.url
          }
        },
        {new:true}
      ).select("-password")

      return res
      .status(200)
      .json(new APIresponse(200,User,"coverimage updated successfully"))

    })
export { 
  registeruser ,
  loginuser,
  logoutuser,
  changecurrentpassword,
  getcurrentuser,
  updateaccountdetails,
  updateuseravatar,
  updateusercoverimage

};
