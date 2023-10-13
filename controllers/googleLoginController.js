const axios = require('axios')
const { userModel } = require('../mongodbControllers/models')
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()

const googleLogin = async (req, res,next) => {

    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${req.body.token}`,
            {
                headers: {
                    Authorization: `Bearer ${req.body.token}`,
                    Accept: 'application/json'
                }
            })
            console.log(response)
            if(response?.data){
                const foundUser = await userModel.findOne({email : response.data.email})
                const data = response.data
                if(!foundUser){
                    const userCreated = await userModel.create({email : data.email,username : data.name,picture: data.picture,role: 'user'})
                    console.log(userCreated)
                    
                }
                const accesstoken = jwt.sign({"username" : data.name},process.env.ACCESS_TOKEN_SECRET,{expiresIn : '3600s'})
                // console.log(accesstoken);
                const refreshToken = jwt.sign({"username" : data.name},process.env.REFRESH_TOKEN_SECRET,{expiresIn : "5d"});
                // console.log(refreshToken)
                const filter = {email : data.email};
                const update = {refreshtoken : refreshToken};
                const opt = {new: true, upsert: true}
                const add = await userModel.findOneAndUpdate(filter,update,opt)
                console.log(add)
                res.cookie('jwt',refreshToken,{httpOnly :true ,sameSite : 'None' , secure : true ,maxAge : 24*60*60*1000 ,path :'/'})
               
                // res.cookie('hello',refreshToken,{httpOnly :true ,sameSite : 'None' , secure : true ,maxAge : 24*60*60*1000 ,path :'/'})
                res.json({accesstoken,email:data.email,username : data.name,role:foundUser? foundUser.role : 'user'}).status(200)
            }
            
    } catch (err) {
        console.log(err)
    }
}



module.exports = { googleLogin }