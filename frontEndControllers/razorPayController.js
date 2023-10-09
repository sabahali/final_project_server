const razorpay = require("razorpay");
const crypto = require('crypto')
const shortid = require('shortid')
var { validatePaymentVerification, validateWebhookSignature } = require('../node_modules/razorpay/dist/utils/razorpay-utils');
const key_secret = 'KqM9HP8kdzh8P0pNTzddPO3G';
const key_id = 'rzp_test_XeMrVt2BwyICcB';
const instance = new razorpay({
    key_id,
    key_secret,
});

const razorpayorder = async (req, res) => {
    console.log('razorpay')
    const totalPrice = req.body.totalPrice
    const payment_capture = 1;
    const amount = 499;
    const currency = "INR";

    const options = {
        amount: totalPrice * 100,
        currency,
        receipt: shortid.generate(),
        payment_capture,
    };

    try {
        const response = await instance.orders.create(options);
        console.log(response);
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        console.log(error);
    }


}

const verifyRazorpay = (req, res) => {
    console.log(req.body)
    const razorpay_signature = req.headers['x-razorpay-signature'];
    // console.log(razorpay_signature)
    const { order_id, payment_id } = req.body;
    let hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(order_id + "|" + payment_id);
    const generated_signature = hmac.digest('hex');
    // console.log(generated_signature)
    if (razorpay_signature === generated_signature) {
        res.json({ success: true, message: "Payment has been verified" }).status(200)
    }
    else
        res.json({ success: false, message: "Payment verification failed" }).status(500)
}

const getallOrders = async(req,res) =>{
    const options = {
        email : 'anirudsh@gmail.com',
        
    }

      const orders =  await instance.orders.all(options)
      console.log(orders)
}

module.exports = { razorpayorder, verifyRazorpay ,getallOrders}