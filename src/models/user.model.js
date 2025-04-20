import mongoose from "mongoose"

const Userschema= new mongoose.Schema({
    username:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,

    },
    username:{
        type:String,
        required:true,

    },
    username:{
        type:String,
        required:true,

    },
    username:{
        type:String,
        required:true,

    },
},{timestamps:true})

export const user=mongoose.model("User",Userschema)