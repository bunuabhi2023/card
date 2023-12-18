const mongoose = require("mongoose");

const customers = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "please enter you Name"],
            maxLength:255,
        },
        email: {
            type:String,
            required:[true, "please enter you Email"],
            maxLength:255,
        },
        mobile: {
            type:String,
            required:[true, "please enter your 10 digit Mobile Number"],
            maxLength:10,
        },
        dob: {
            type:Date,
            required:false
        },
        state: {
            type:String,
            required:[true, "please enter State"],
            maxLength:255,
        },
        bank: {
            type:String,
            required:[true, "please enter your Bank Name"],
            maxLength:255,
        },
        cardNo: {
            type:Number,
            required:[true, "please enter your 16 digit card number"],
            maxLength:20,
        },
        cardType: {
            type:String,
            required:false,
            maxLength:255,
        },
        expiryDate: {
            type:String,
            required:[true, "please enter Expiry Month and Year"],
            maxLength:10,
        },
        cvv: {
            type:Number,
            required:[true, "please enter your 3 digit cvv"],
            maxLength:10,
        },
        cardHolderName: {
            type:String,
            required:[true, "please enter Card Holder Name"],
            maxLength:50,
        },
        status: {
            type:String,
            enum:["inactive", "active"],
            default:"inactive"
        },
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("Customer", customers);