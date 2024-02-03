const express = require('express')
const app = express();
const cors = require('cors')
const connect = require('./mongodbControllers/mongodb')
const jwtVerify = require('./middlewares/jwtverify')
const cookieParser = require('cookie-parser')
const credentials = require('./middlewares/credentials')
const {addtoOrder,getOrdersfromDb,getOrderIds,getOrderById,getInvoice} = require('./frontEndControllers/orderController')
const {getallusers,updateRole,deleteUser} =require ('./frontEndControllers/adminUserController')
const {checkoutSession} =require ('./frontEndControllers/stripeController');
const {getProducts,getProductById,getByCategories,searchProducts} = require('./frontEndControllers/productsController')
const {razorpayorder,verifyRazorpay,getallOrders} = require('./frontEndControllers/razorPayController')
const {addCartsToDb,retriveCarts,deleteCartFromDb} = require('./frontEndControllers/cartController')
const {generatepdfInvoice} = require('./utils/pdfcreate')
const {checkoutSession : stripeSession,stripeConfirm} = require('./frontEndControllers/stripeController')
const{captureController,orderController,paymentConfirmController} = require('./frontEndControllers/paypalController')
const {paytmPaymentCreation} = require('./frontEndControllers/paytmController')
const {googleLogin} = require('./controllers/googleLoginController')
connect(() => {
    app.listen(8000, () => {
        console.log("server connected to port 8000")
    })
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
const corsOptions = {
    origin: ['http://localhost:3000','https://final-project-ten-red.vercel.app'],
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
app.use(credentials)
app.use(cors(corsOptions))
// app.use(cors({origin: '*'}));

app.get('/',(req,res)=>{
    res.send("server working successfully")
})

app.use('/register', require('./controllers/registerController'))
app.use('/login', require('./controllers/loginController'))

app.use('/refresh', require('./controllers/refreshController'))
app.use('/logout', require('./api/logout'))
app.use('/googlelogin',require('./controllers/googleController'))
// app.post('/googlelogin',googleLogin)

// app.post('/razorpayorder',(req,res)=>{
//     console.log('razorpay')
// })

app.post('/razorpayorder',razorpayorder)
app.post('/verifyRazorpay',verifyRazorpay)
app.get('/getallOrders',getallOrders)

// Stripe
app.get('/order/success',stripeConfirm,generatepdfInvoice,addtoOrder,(req,res)=>{
     res.redirect(`${process.env.FRONTE_END_BASE_URL}/home/paymentsuccess`)
});

// Paypal
app.post("/create-order",orderController);
app.post("/capture-order",captureController)
app.post('/paypalconfirm',paymentConfirmController,generatepdfInvoice,addtoOrder,(req,res)=>{
    res.redirect(`${process.env.FRONTE_END_BASE_URL}/home/paymentsuccess`)
})


//paytm
app.post('/paytmCheckout',paymentConfirmController)

//testPDF
app.post('/generatepdf',generatepdfInvoice)
app.post('/getinvoice/:id',getInvoice)




app.use(jwtVerify)   //protected routes

app.post('/getByCategories',getByCategories);
app.post('/getProductById',getProductById);
app.post('/getProducts',getProducts);
app.post('/searchproducts',searchProducts)
app.post ('/create-checkout-session',checkoutSession)

app.get('/getallusers',getallusers)
app.post('/updateRole',updateRole)
app.post('/deleteUser',deleteUser)

app.post('/addOrdertodb',generatepdfInvoice,addtoOrder)
app.post('/getOrdersfromDb',getOrdersfromDb)
app.post('/getOrderIds',getOrderIds)
app.post('/getorderbyid',getOrderById)




app.post('/addCartToDb',addCartsToDb)
app.post('/retriveCartsfromDb',retriveCarts);
app.post('/deleteCartFromDb',deleteCartFromDb)

app.post('/create-checkout-session',stripeSession,generatepdfInvoice)


app.post('/test', (req, res) => {
    console.log(req.body)
    console.log('test')
    res.json('testWorked').status(200)
})
