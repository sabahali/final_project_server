const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { userModel } = require('../mongodbControllers/models')
require('dotenv').config()

router.get('/', async (req, res) => {

    const cookies = req.cookies;
    // res.json({obj : req.cookies.jwt })
    // res.json({object : "hello"})
    // console.log(cookies.jwt)
    if (!cookies?.jwt) res.sendStatus(404)
    if (cookies?.jwt) {
        const decoded = await jwt.verify(req.cookies.jwt, process.env.REFRESH_TOKEN_SECRET)
        if (!decoded?.username) res.sendStatus(404)
        else if (decoded.username) {
            const foundUser = await userModel.findOne({ username: decoded.username })
            if (foundUser) {
                try {
                    const accesstoken = await jwt.sign({ "username": decoded.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' })
                    // console.log(foundUser)
                    // console.log(accesstoken)


                    res.json({ accesstoken ,username : foundUser.username,email:foundUser.email,role:foundUser.role})

                } catch (err) {
                    res.status(500).send(err)
                }


            }


        }
    }

})

router.get('/initialRefresh',(req,res)=>{
    
})

module.exports = router;