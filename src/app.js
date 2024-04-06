import  express, { urlencoded }  from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app=express()

app.use(cors({
    origin:process.env.CORS_ORGIN,
    credentials:true,
}))

app.use(express.json({limit:"16kb"}))
app.use(express.static("public"))
app.use(urlencoded({extended:true}))
app.use(cookieParser())




//importing routes

import userRouter from"./routes/user.routes.js"




//declaring routes

app.use("/api/v1/users",userRouter)






export {app}