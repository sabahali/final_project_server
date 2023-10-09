require('dotenv').config()
const stripe = require('stripe')('sk_test_51NM31RSHQMvGYYZ8dNLOTcGX4FeijT9GnPji7VcKSZ45lPpXPXl1y0dYFYxYxYw2FlQB5NmuwwsT0E7io3kiglRU00ZdqqrTyH');
const fs = require('fs');
const path = require('path')
require('dotenv').config()

const success = `${process.env.BACK_END_BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`
const fail = `${process.env.FRONTE_END_BASE_URL}/home/paymentfailed`
const checkoutSession = async(req,res) =>{
    // console.log(req.body)
    const items = JSON.stringify(req.body)
    // localStorage.setItem('checkoutItems',JSON.stringify(req.body))
    fs.writeFileSync('checkoutData',items,{
        encoding : 'utf-8'
    })

    const found = req.body.find(item => item.email)
    let customer_email;
    if (found?.email) {
        customer_email = found.email;
    } else {
        customer_email = 'guest@gmail.com'
    }
    const line_items = req.body.map((item) => {
        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.title,

                },
                unit_amount: item.price * 100
            },
            quantity: item.count
        }
    })
    // console.log(line_items)
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            billing_address_collection: 'required',

            customer_email: customer_email,
            success_url: `${success}`,
            cancel_url: `${fail}?`,
            // phone_number_collection: { enabled: true },
            
            shipping_address_collection: {
                allowed_countries: ['IN']
            }
        });
        // console.log(session)
        res.json({ id: session.id })



    } catch (err) {
        console.log(err.message)
    }
}
const stripeConfirm = async (req,res,next) =>{
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    // console.log(session)
    const filePath = path.join(__dirname, '..', 'checkoutData');
    // const checkoutItems = JSON.parse(localStorage.getItem('checkoutItems'));
    if(fs.existsSync(filePath)){
        const data = fs.readFileSync(filePath,'utf8')
        const checkoutItems = JSON.parse(data)
        req.body.order_id = session.payment_intent;
        req.body.checkoutItems = checkoutItems;
        
        req.body.address = session.customer_details.address.line1
        req.body.statec = session.customer_details.address.state
        req.body.city = session.customer_details.address.city
        req.body.zip = session.customer_details.address.postal_code
        req.body.handle = 'stripe'
        // console.log(req.body)
        fs.unlinkSync(filePath)
        next()
    }

    
   
    
}


module.exports = {checkoutSession,stripeConfirm}