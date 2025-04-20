import 'dotenv/config';
import {connectDB} from "./src/db/index.js"
import { app } from './src/app.js';
connectDB()
.then(()=>{
    app.listen(process.env.PORT ,()=>{
        console.log(`server is running at http://localhost:${process.env.PORT}`)
    })
    
})
.catch((error)=>{
    console.log(`mongogb Connection failed ${error.message()}`)
    })
