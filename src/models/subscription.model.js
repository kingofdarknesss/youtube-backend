import mongoose, { Schema } from "mongoose";

const subsciptionSchema=new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },

    channel:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true})




export const subsciption=mongoose.model("subsciption",subsciptionSchema)