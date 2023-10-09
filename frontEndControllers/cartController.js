const {cartModel} = require('../mongodbControllers/models')

const addCartsToDb = async(req,res) =>{
    // console.log(req.body)
    const {email,cartNumber,carts} = req.body;
    // console.log(email)
    if(email && cartNumber && carts){
        const found = await cartModel.findOne({email})
    if(found){
        const response = await cartModel.findOneAndUpdate({email},{cartNumber,carts},{new:true})
    }else{
        const response = await cartModel.insertMany({email,cartNumber,carts})
        // console.log(response)
    }

    }
    
}

const retriveCarts = async(req,res) =>{
    const {email} = req.body;
    if(email){
        const found = await cartModel.findOne({email})
        if(found){
            res.send(found).status(200)
        }
    }
}
const deleteCartFromDb = async(req,res) =>{
    console.log(req.body)
    const {email} = req.body;
    console.log('deleting from db')
    if(email){
        const response = await cartModel.deleteOne({email})
        console.log(response)
    }
}

module.exports = {addCartsToDb,retriveCarts,deleteCartFromDb}