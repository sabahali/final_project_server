var PaytmChecksum = require("./PaytmChecksum");
require('dotenv').config()
const {v4:uuidv4} = require('uuid')

const paytmPaymentCreation = (req,res) =>{
    var paytmParams = {};

    /* initialize an array */
    paytmParams["MID"] = "YOUR_MID_HERE";
    paytmParams["ORDERID"] = "YOUR_ORDER_ID_HERE";

    var paytmChecksum = PaytmChecksum.generateSignature(paytmParams, "YOUR_MERCHANT_KEY");
    paytmChecksum.then(function(checksum){
        console.log("generateSignature Returns: " + checksum);
    }).catch(function(error){
        console.log(error);
    });
}
module.exports = {paytmPaymentCreation}