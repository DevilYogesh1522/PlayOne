import {v2 as cloudinary} from "cloudinary"
import { response } from "express";
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnLCloudinary =async (localfilepath)=>{
    try {
        if(!localfilepath) return null;
        
            const response = await cloudinary.uploader.upload(localfilepath,
                {resource_type:"auto"}
            )
        
        //file has been uploded successsfully
        console.log("file is uploded on cloudinary",response.url)
        return response;
    } catch (error) {
        fs.unlinkSync(localfilepath);
        //removes the locally saved tempory file as the uploded operation got failed
        return null
    }

}
export {uploadOnLCloudinary}