const mongoose = require("mongoose");

const users = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "please enter you Name"],
            maxLength:255,
        },
        email: {
            type:String,
            required:[true, "please enter you Email"],
            unique: true,
        },
        password: {
            type:String,
            required:[true, "please enter your password"],
            minLength: [8, "Password must be at least 8 Characters"],
        },
        mobile: {
            type:String,
            required:[true, "please enter your 10 digit Mobile Number"],
            unique: true,
            maxLength:10,
        },
        role:{
            type:String,
            enum:["Super Admin", "Admin"],
            default:"Admin"
        },
        dob: {
            type:Date,
            required:false,
        }, 
        status: {
            type:String,
            enum:["inactive", "active", "rejected"],
            default:"inactive"
        },
        city:{
            type:String,
            required:false,
            maxLength:255,
        },
        state:{
            type:String,
            required:false,
            maxLength:255,
        },
        pincode:{
            type:String,
            required:false,
            maxLength:50,
        },
        address:{
            type:String,
            required:false,
            maxLength:255,
        },
        deviceId:{
            type:String,
            required:false,
            maxLength:800,
        },
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("User", users);