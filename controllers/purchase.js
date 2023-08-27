const Razorpay = require('razorpay');
const Order = require('../models/Orders');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
//const userController = require('./User'); // Import userController to access generateAccessToken function


function generateAccessToken(id,ispremiumuser,name){
    return jwt.sign({userId:id, ispremiumuser:ispremiumuser,name:name},process.env.JWT_TOKEN); //secret key
}


exports.purchasePremium = (req, res, next) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 2500;
        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(err);
            }
            const response = await Order.create({ orderid: order.id, status: 'PENDING', userId: req.user.userId });
            if (response) {
                return res.status(201).json({ order, key_id: rzp.key_id });
            }
        });
    } catch (err) {
        console.log('Error in purchasePremium controller');
        res.status(500).json({ error: err, message: "Something went wrong" });
    }
};

exports.updateTransactionStatus = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        const promises = [];

        // Update the order's payment status
        promises.push(order.update({ paymentid: payment_id, status: 'SUCCESSFUL' }));

        // Get the user and update the premium status
        const user = await User.findByPk(req.user.userId);
        if (user) {
            promises.push(user.update({ ispremiumuser: true }));
        }

        // Wait for both updates to complete
        await Promise.all(promises);

        // Generate an updated access token
       const updatedToken = generateAccessToken(user.id,user.ispremiumuser,user.name)
        return res.status(202).json({ success: true, message: "Transaction Successful", ispremiumuser: true, token: updatedToken });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: "Something went wrong in updateTransaction" });
    }
};
