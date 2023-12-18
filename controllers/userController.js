const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { options } = require("../routes/route");
require("dotenv").config();
const multer = require('multer');
const ErrorHandler = require("../utils/ErrorHandler");
const admin = require('firebase-admin'); 
const serviceAccount = require('../serviceAccount.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

exports.createAdmin = async (req, res) => {
    try {
      const { name, email, mobile, password, dob, city, state, pincode, address } = req.body;
  
      // Check if the email or mobile already exists in the database
      const existingUser = await User.findOne({
        $or: [{ email }, { mobile }],
      });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email or mobile already exists' });
      }
  
      // Hash the password before saving it to the database
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create the new customer object with the hashed password
      const newUser = new User({
        name,
        email,
        mobile,
        password: hashedPassword,
        dob,
        city, 
        state, 
        pincode,
        address
      });
  
      // Save the new customer to the database
      await newUser.save();
  
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error during customer signup:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };
  

  exports.login = async (req,res, next) => {
    try {

        //data fetch
        const {email, password} = req.body;
        //validation on email and password
        if(!email || !password) {
          return next(new ErrorHandler("PLease fill all the details carefully", 400));
           
        }

        //check for registered user
        let user = await User.findOne({email});
        //if not a registered user
        if(!user) {
          return next(new ErrorHandler("User is not registered", 400));
        }
        console.log(user._id)

        const payload = {
            email:user.email,
            _id:user._id,
            role:user.role,
            tokenVersion: user.tokenVersion,
        };
        //verify password & generate a JWT token
        if(await bcrypt.compare(password,user.password) ) {
            //password match
            let token =  jwt.sign(payload, 
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"15d",
                                });
                  

            // Save the updated user record
            await user.save();
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date( Date.now() + 15 * 24 * 60 * 60 * 1000),
                httpOnly:true,
                sameSite: 'none',
                secure: true,
            }

            

            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'User Logged in successfully',
            });
        }
        else {
          return next(new ErrorHandler("Password Incorrect", 401));
        }

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure',
        });

    }
};
 
  exports.getUser = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const filters = {};
      filters.role = 'Admin';
      if (req.query.city) {
        filters.city = { $regex:req.query.city, $options: 'i' };
      }
  
      if (req.query.state) {
        filters.state = { $regex:req.query.state, $options: 'i' };
      }
  
      if (req.query.name) {
        filters.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive name search
      }
  
      const users = await User.find(filters)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();
  
      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
  ;
  
      return res.json({ users: users });
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };
  
  exports.getUserById = async (req, res) => {
    try {
  
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.json({ user});
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };
  
  exports.updateUser = async(req,res) =>{
   
      const { name, email, mobile, dob, city, state, pincode,address} = req.body;
      
      try {
        const existingUser = await User.findById(req.params.id);
  
        if (!existingUser) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        
        const duplicateUser = await User.findOne({
          $and: [
            { _id: { $ne: existingUser._id } }, 
            { $or: [{ email }, { mobile }] }, 
          ],
        });
  
        if (duplicateUser) {
          return res.status(400).json({ error: 'Email or mobile already exists for another user' });
        }
        
  
        const user = await User.findById(req.params.id);
         user.name = name;
         user.email = email;
         user.mobile = mobile;
         user.dob = dob;
         user.city = city;
         user.state =state;
         user.pincode =pincode;
         user.address = address;
         user.updatedAt = Date.now()
  
        const updatedUser = await user.save();
        console.log(updatedUser); // Add this line for debug logging
        res.json(updatedUser);
      } catch (error) {
        console.error(error); // Add this line for debug logging
        return res.status(500).json({ error: 'Failed to update User' });
      }
  };
  
  
  exports.deleteUser = async (req, res) => {
    try {
      const deleteUser = await User.findByIdAndDelete(req.params.id);
      if (!deleteUser) {
        console.log(`User with ID ${req.params.id} not found`);
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to delete User' });
    }
  };
  
  exports.updateUserStatus =async(req, res) =>{
    try {
      const updateStatus =await User.findOneAndUpdate(
        {_id:req.body.userId},
        {status: req.body.status},
        {new:true}
      );
      if (!updateStatus) {
        console.log(`User with ID ${req.body.UserId} not found`);
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User Status Updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to Update Status' });
    }
  };
  
  exports.updatePassword = async (req, res) => {
   
    try {
      // Find the user by ID
      const { newPassword, confirmPassword} = req.body;
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Validate the new password and confirmation
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the password in the user document
      user.password = hashedPassword;
      user.tokenVersion += 1;
      await user.save();
  
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error during password update:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };

  