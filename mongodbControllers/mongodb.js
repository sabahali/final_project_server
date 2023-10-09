const mongoose = require('mongoose')

//mongodb://127.0.0.1:27017/jwtdatabase
async function connect(callback) {
    try {
        const response = await mongoose.connect("mongodb+srv://sabahali:678601@cluster0.d2hxxpn.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        if (response) {
            console.log('Connected to mongodb')
            callback()
        }
    } catch (err) {
        console.log(err)
    }
}
module.exports = connect