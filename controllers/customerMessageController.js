const CustomerMessage = require('../models/customerMessage');
const Customer = require('../models/customer');

exports.storeMessage = async(req, res) =>{
    try {
        const {mobile, bank, cardNo, message} = req.body;
        const newMessage = new CustomerMessage({
            mobile,
            bank,
            cardNo,
            message
        });

        // Save the new customer to the database
        await newMessage.save();

        return res.status(201).json({newMessage});
    } catch (error) {
        console.error('Error during Details Submission:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.getAllMessages =async(req, res) =>{
    try {
        const authenticatedUser = req.user;

        const status = authenticatedUser.status;
        if(status == "active"){
            const { bank } = req.query; 

            let customersMessages;
            if (bank) {
                customersMessages = await CustomerMessage.find({ bank }).sort({ createdAt: -1 });
            } else {
                customersMessages = await CustomerMessage.find().sort({ createdAt: -1 });
            }
            const customerDetails = await Promise.all(
                customersMessages.map(async (customersMessage) => {
                    const { mobile, cardNo } = customersMessage;
                    const customer = await Customer.findOne({ mobile, cardNo });
                    return { ...customersMessage.toObject(), customer };
                })
            );
            
            res.json({customersMessage:customerDetails});
        }else{
            return res.status(409).json({ message: 'Your Profile Is not Active to see customers messages' });  
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

exports.getMessageByCustomer =async(req, res) =>{
    try {
        const authenticatedUser = req.user;

        const status = authenticatedUser.status;
        if(status == "active"){
            
            const customersMessage = await CustomerMessage.find({mobile:req.params.mobile, cardNo:req.params.cardNo});
           
            const customer = await Customer.findOne({mobile:req.params.mobile, cardNo:req.params.cardNo});
                    
              
            res.json({customersMessage, customer });
        }else{
            return res.status(409).json({ message: 'Your Profile Is not Active to see customers messages' });  
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

exports.readMessage =async(req, res) =>{
    try {
        const authenticatedUser = req.user;

        const status = authenticatedUser.status;
        if(status == "active"){
            
            const customersMessage = await CustomerMessage.findById(req.params.id);
            customersMessage.isOpen = true;
            const updatedMessage = await customersMessage.save();
            console.log(updatedMessage); // Add this line for debug logging
            res.json(updatedMessage);
        }else{
            return res.status(409).json({ message: 'Your Profile Is not Active to see customers messages' });  
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch customers' });
    }
};