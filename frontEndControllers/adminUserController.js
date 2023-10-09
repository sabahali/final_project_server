const { userModel, orderModel,cartModel} = require('../mongodbControllers/models')

const getallusers = async (req, res, next) => {
    const users = await userModel.find()
    // console.log(users)
    res.send(users)


}

const updateRole = async (req, res) => {
    console.log(req.body)
    if (req.body.id == '650dbef5fb1f4776ca9b58f4') {
        res.sendStatus(405)
        console.log('Not allowed')
        return
    } else {
        const filter = { _id: req.body.id }
        const update = { role: req.body.role }
        const opt = { new: true, upsert: true }
        const response = await userModel.findOneAndUpdate(filter, update, opt);
        // console.log(response)
        if (response) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    }

}

const deleteUser = async(req, res) => {
        const {id,email} = req.body
    if (req.body.id == '650dbef5fb1f4776ca9b58f4') {
        res.sendStatus(405)
        return
    } else {
        console.log(req.body);
        const response = await userModel.findByIdAndDelete(req.body.id);
        
        const orderModelresponse = await orderModel.deleteMany({email});
        const cartModelresponse = await cartModel.deleteMany({email})

        if (response) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    }
}


module.exports = { getallusers,updateRole, deleteUser,}