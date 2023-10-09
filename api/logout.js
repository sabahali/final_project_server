const express = require('express')
const router = express.Router()
const {logouthandler} = require('../controllers/logoutController')

router.get('/',logouthandler)



module.exports = router