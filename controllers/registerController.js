const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { userModel } = require('../mongodbControllers/models')
require('dotenv').config()

router.post('/', async (req, res, next) => {
    // console.log(req.body)
    const { username, pwd } = req.body;
    // const hash = bcrypt.hashSync(pwd, 5)
    // console.log(hash)
    if (!username || !pwd) res.sendStatus(400).send("Need username and pwd")
    const data = await userModel.findOne({ username })
    // console.log(data)
    // console.log(data)
    if (data !== null) res.sendStatus(409)

    else {
        const hash = bcrypt.hashSync(pwd, 5)
        // console.log(hash)
        userModel.create({...req.body , pwd : hash}).then((resp) => console.log(resp));
        res.sendStatus(201)
    }

})




module.exports = router;