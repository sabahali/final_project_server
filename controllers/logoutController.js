const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { userModel } = require('../mongodbControllers/models')
require('dotenv').config()

const logouthandler = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        res.sendStatus(404)
        return
    } 
    const refreshtoken = req.cookies.jwt;
    const foundUser = await userModel.findOne({ refreshtoken })
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly :true ,sameSite : 'None' , secure : true ,maxAge : 24*60*60*1000 ,path :'/' })
        res.sendStatus(404)
        return
    } else {
        const update = await userModel.findByIdAndUpdate({ _id: foundUser._id }, { refreshtoken: '' }, { new: true })
        if (update) {
            res.clearCookie('jwt', {httpOnly :true ,sameSite : 'None' , secure : true ,maxAge : 24*60*60*1000 ,path :'/'})
            res.sendStatus(204)
            return
        }else{
            res.sendStatus(500)
        }


    }

}

module.exports = { logouthandler }