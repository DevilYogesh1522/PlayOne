import express from "express"
//import cookieParser from "cookie-parser"
import cors from "cors"

const app=express()
app.use(cors())
app.use(express.json())

//routes

import userroute from "./routes/user.routes.js"
//routes Declaration

app.use('/user',userroute)
export {app}