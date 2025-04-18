import mongoose from "mongoose"
import { DB_Name } from "../constants.js"

export const connectDB=(async()=>{
           try {
               const connectinstance=await mongoose.connect(`${process.env.MONGODB_URI}`)
               console.log(`Mongodb connected successfully !! ${connectinstance.connection.host}`);
               
           } catch (error) {
            
             console.error(`Mongodb Connection Failed ${error.message}`)
             process.exit(1)
           }
})