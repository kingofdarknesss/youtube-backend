// require('dotenv').config({path:'./env'})

// import mongoose from "mongoose";
// import  express  from "express";
// import { DB_NAME } from './constants';
import connectDB from "./db/index.js";
import dotenv from 'dotenv'

dotenv.config({path:'./env'})




connectDB()





// const app=express()

// (async ()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("err",(error)=>{
//         console.log("app cannot listen to db",error)
//         throw error
//        })
//        app.listen(process.env.PORT,()=>{
//         console.log(`App is listening on port ${process.env.PORT}`)
//        })
        
//     } catch (error) {
//         console.error("ERROR",error)
//         throw error;
        
//     }

// })()