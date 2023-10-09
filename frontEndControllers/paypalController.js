

const CLIENT_ID = 'AYZChBET8dUB2aNW1v_ASKotnbIt4sHLq1Qioanc0EnhM0SmF1EDVX3k2EUp4dKQtm3cMABAdu92omDJ';
const APP_SECRET = 'EORup1y1qA8dTl-vmhVFxSNeuIKFq_pa5vFxalgx9gyeGKZPXyXUFvTHqUyOutimP2G9k_tvi9WTJl5a';

const base = "https://api-m.sandbox.paypal.com";
const generateAccessToken = async () => {
    try {
        const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
        const response = await fetch(`${base}/v1/oauth2/token`, {
          method: "post",
          body: "grant_type=client_credentials",
          headers: {
            Authorization: `Basic ${auth}`,
          },
        });
      
        const data = await response.json();
        return data.access_token;
    } catch(error) {
        console.error("Failed to generate Access Token:", error);
    } 
  };

  const createOrder = async (amount) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
        {
            amount: {
            currency_code: "USD",
            value: `${(amount/84).toFixed(2)}`,
            },
        },
        ],
    };
    
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
    });
  
    return handleResponse(response);
  };

  const capturePayment = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;
  
    const response = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
    });
    // console.log(response)
    return handleResponse(response);
  };

  async function handleResponse(response) {
    if (response.status === 200 || response.status === 201) {
      return response.json();
    }
  
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
  
  const orderController = async (req,res) =>{
    let amount = 0
  // checkoutItems.forEach((item)=>{
  //   amount += (item.price * item.count)
  // })
  // console.log(req.body)
    req.body.forEach((item) => {
      amount += item.price * item.count;
    });
 

    console.log('creating order')
    console.log(req.body)
    console.log(amount)
    try{
        const response = await createOrder(amount);
        // console.log(response)
        res.json(response);
    } catch(error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
  }

  const captureController = async(req,res) =>{
    try {
        const { orderID } = req.body;
        const response = await capturePayment(orderID);
        // console.log(response)
        res.json(response);
    } catch (error){
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
  }
  const paymentConfirmController = (req,res,next) =>{
    req.body.address=req.body.userData[0].shipping.address.address_line_1;
    req.body.statec=req.body.userData[0].shipping.address.admin_area_1;
    req.body.city=req.body.userData[0].shipping.address.admin_area_2;
    req.body.zip=req.body.userData[0].shipping.address.postal_code;
    // req.body.handle = 'stripe'
    // console.log('paypalconfirm',req.body)
    next()
  }

  module.exports = {captureController,orderController,paymentConfirmController}