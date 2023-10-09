const express = require("express")
const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtVerify = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (req?.headers?.authorization) {


        const token = authHeader.split(' ')[1];
        console.log(token)
        try {
            const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            // res.sendStatus(200)
            next()
        } catch (err) {
            res.sendStatus(403)
        }
    } else {
        res.sendStatus(403)
    }



}



module.exports = jwtVerify











