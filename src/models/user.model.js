import mongoose from "mongoose"
import jwt from "jsonwebtoken"
const Userschema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true

    },
    fullname:{
        type:String,
        required:true,
        lowercase:true,
        trim:true

    },
    avatar:{
        type:String,
        required:true,
        

    },
    coverimage:{
        type:String,
       

    },
    watchhistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    password:{
        type:String,
        required:[true," Password is required "]
    },
    refreshtoken:{
        type:String,
        
    }
},{timestamps:true})

Userschema.pre("save" , async function (next){

    if(!this.ismodified("password")) return next()
    this.password= await bcrypt.hash(this.password,5)
    next()
})

Userschema.methods.isPasswordCorrect =async function(password){
        return await  bcrypt.compare(password,this.password)
}
Userschema.methods.generateAccessToken=function(){
  return  jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
Userschema.methods.generateRefreshtoken=function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:REFRESH_TOKEN_EXPIRY
        }
    )
}
export const user=mongoose.model("User",Userschema)