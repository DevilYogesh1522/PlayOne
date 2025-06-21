import jwt from "jsonwebtoken"
import { APIError } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";
import { user } from "../models/user.model.js";
export const varifyjwt=asynchandler(async(req,_,next)=>{
    try {
        const token = req.cookie?.accesstoken || req.header("Authorization")?.replace("Bearer ","")
    
       if(!token){
        throw new APIError(400,"unauthorized request")
       }
    
       const decodedjwt=jwt.varifyjwt(token,process.env.ACCESS_TOKEN_SECRET)
       const User=await user.findById(decodedjwt._id).select("-password -refreshtoken")
         
        if(!User){
            throw new APIError(401,"Invalid Access Token")
        }

        req.User=User;
        next()
    } catch (error) {
        throw new APIError(404,error?.message ||"something went wrong")
    }
})