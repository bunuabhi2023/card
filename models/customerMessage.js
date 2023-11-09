const mongoose = require("mongoose");

const customermessage = new mongoose.Schema(
    {
        mobile:{
            type:String,
            required:false,
            maxLength:10,
        },
        bank:{
            type:String,
            required:false,
            maxLength:10,
        },
        cardNo: {
            type:Number,
            required:false,
            maxLength:20,
        },
        message: {
            type:String,
            required:false,
            maxLength:5000,
        },
        isOpen: {
            type:Boolean,
            default:false,
        },
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("CustomerMessage", customermessage);