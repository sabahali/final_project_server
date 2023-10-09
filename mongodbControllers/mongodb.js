const mongoose = require('mongoose')

//mongodb://127.0.0.1:27017/jwtdatabase
async function connect(callback) {
    try {
        const response = await mongoose.connect('mongodb://127.0.0.1:27017/jwtdatabase', {
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