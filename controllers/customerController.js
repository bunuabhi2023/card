const Customer = require('../models/customer');

exports.submitDetails = async(req,res) =>{
    try {
        const { name, email, mobile, dob, state, cardNo, expiryDate, cvv, cardHolderName } = req.body;
    
        const newCustomer = new Customer({
          name,
          email,
          mobile,
          email, 
          mobile, 
          dob, 
          state, 
          cardNo, 
          expiryDate, 
          cvv, 
          cardHolderName
        });
    
        // Save the new customer to the database
        await newCustomer.save();
    
        return res.status(201).json({ message: 'Details Submited successfully' });
      } catch (error) {
        console.error('Error during Details Submission:', error);
        return res.status(500).json({ message: 'Something went wrong' });
      }
};

exports.getDetails =async(req, res) =>{
    try {
        const authenticatedUser = req.user;

        const status = authenticatedUser.status;
        if(status == "active"){
            
            const customers = await Customer.find();
            
            res.json({customer:customers});
        }else{
            return res.status(409).json({ message: 'Your Profile Is nOt Active to see customers Details' });  
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch customers' });
    }
}