const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { userModel } = require('../mongodbControllers/models')
require('dotenv').config()

router.post('/',async(req,res,next)=>{
    const {secure} = req;
    // console.log(req.body)
    const {username,pwd} = req.body;
    if(!username || !pwd) res.sendStatus(404)
    if(username){
        const foundUser = await userModel.findOne({username})
        // console.log(foundUser)
        if(!foundUser?.username) res.json({success : false}).status(404)
        else{
            const match = bcrypt.compareSync(pwd,foundUser.pwd);
            if(match){
                
                
                const accesstoken = jwt.sign({"username" : username},process.env.ACCESS_TOKEN_SECRET,{expiresIn : '3600s'})
                // console.log(accesstoken);
                const refreshToken = jwt.sign({"username" : username},process.env.REFRESH_TOKEN_SECRET,{expiresIn : "5d"});
                // console.log(refreshToken)
                const filter = {username : username};
                const update = {refreshtoken : refreshToken};
                const opt = {new: true, upsert: true}
                const add = await userModel.findOneAndUpdate(filter,update,opt)
                // console.log(add)
                res.cookie('jwt',refreshToken,{httpOnly :true ,sameSite : 'None' , secure : true ,maxAge : 24*60*60*1000 ,path :'/'})
                res.json({accesstoken,email:foundUser.email,username : foundUser.username,role:foundUser.role}).status(200)
                return
                
            }else{
                res.json({success : false}).status(404)
            }
        }
    }
});








module.exports = router;