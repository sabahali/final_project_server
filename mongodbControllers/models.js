const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : String,
    pwd : String,
    email : String,
    role : String,
    refreshtoken : String
});

const orderSchema = new mongoose.Schema({
    order : Object,
    email : String,
    order_id : String,
    date : String,
    invoice:
    {
        data: Buffer,
        contentType: String,
    }
    
},{
    timestamps : true,
})

const cartShemea = new mongoose.Schema({
    email : String,
    carts : Object,
    cartNumber : Number,
})


const userModel = mongoose.model('users',userSchema);

const orderModel = mongoose.model('orders',orderSchema);
const cartModel = mongoose.model('carts',cartShemea)
module.exports = {userModel,orderModel,cartModel}
