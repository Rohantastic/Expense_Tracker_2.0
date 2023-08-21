const Razorpay = require('razorpay');
const Order = require('../models/Orders');
const User = require('../models/User');

exports.purchasePremium = (req, res, next) => {
    try {
        var rzp = new Razorpay({
            key_id: "rzp_test_yG03WciVhl4Gc0",
            key_secret: "QBZ7tIyw94KmLF5FDalICpUw"
        });
        const amount = 2500;
        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(err);
            }
            //const response = await req.user.createOrder({ orderid: order.id, status: 'PENDING' });
            const response = await Order.create({orderid: order.id, status: 'PENDING', userId: req.user.userId});
            if (response) {
                return res.status(201).json({ order, key_id: rzp.key_id,});
            }
        });
    } catch (err) {
        console.log('Error in purchasePremium controller');
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

        return res.status(202).json({ success: true, message: "Transaction Successful", ispremiumuser:true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: "Something went wrong in updateTransaction" });
    }
};


// exports.updateTransactionStatus = async (req, res, next) => {
//    try{
//         const { payment_id, order_id } = req.body;
//         //const order = await Order.findOne({where: order_id});
//         const order = await Order.findOne({ where: { orderid: order_id } });
//         const promise1 =  order.update({paymentid: payment_id, status: 'SUCCESSFUL'});
//         const promise2 =  req.user.update({ispremiumuser: true});
//         Promise.all([promise1,promise2]).then(()=>{
//             return res.status(202).json({success: true, message:"Transaction Successfull"});
//         }).catch((err)=>{
//             throw new Error(err);
//         });
        
        
//    }catch(err){
//         console.log(err);
//         res.status(403).json({error: err, message: "something went wrong in updateTransaction"});
//    }
// };