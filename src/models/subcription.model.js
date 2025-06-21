import mongoose from "mongoose"

const subcriptionschema= new mongoose.Schema({

    subcriber:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
            },
     channel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
            },
},{timestamps:true})
export const subcription=mongoose.model('subcription',subcriptionschema)