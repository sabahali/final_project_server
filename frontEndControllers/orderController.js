const express = require('express')
const router = express.Router()
const { userModel, orderModel } = require('../mongodbControllers/models')
const fs = require('fs');
const PDFDocument = require('pdfkit');
const moment = require("moment");
const path = require('path')



const addtoOrderDb = async (req, res, next) => {
    console.log('adding to order')
    const { checkoutItems, order_id ,handle} = req.body;
    const found = checkoutItems.find((item) => item);
    const email = found.email;
    const filePath = path.join(__dirname, '..', 'invoice.pdf');
    const data = fs.readFileSync(filePath)
    const invoice = {
        data: fs.readFileSync(filePath),
        contentType: 'application/pdf',
    }


    if (found && order_id) {
        const date = moment().format("MM/DD/YYYY HH:mm:ss")
        const response = await orderModel.insertMany({ order: checkoutItems, email: email, order_id, date, invoice: invoice });
        if (response) {
            fs.unlinkSync(filePath)
            console.log(handle)
            if(handle == 'stripe'){
                next()
            }else{
                res.sendStatus(201)
            }
            
        }
    }


}

const getOrdersfromDb = async (req, res, next) => {
    const { email } = req.body;
    console.log(email)
    const response = await orderModel.find({ email: email }, { order: 1, _id: 0 })

    if (response) {

        const flatArray = [].concat(...response.map(item => item.order));
        console.log(flatArray);
        res.send(flatArray)
    } else {
        res.sendStatus(500)
    }
}

const getOrderIds = async (req, res) => {
    console.log(req.body)
    const { email } = req.body;
    const response = await orderModel.find({ email: email }, { order_id: 1,date:1, _id: 0 })
    if (response) {
        console.log(response)
        res.send(response)
    }
}

const getOrderById = async (req, res) => {
    const { id } = req.body;
    console.log(id)
    const response = await orderModel.find({ order_id: id }, { order: 1, _id: 0 })
    // console.log(response)
    if (response) {
        const flatArray = [].concat(...response.map(item => item.order));
        // console.log(flatArray);
        res.send(flatArray)
    }
}

const getInvoice = async (req, res) => {
    // console.log(req.headers)
    const id = req.params.id;
    console.log(id)
    const response = await orderModel.find({ order_id: id }, { invoice: 1, _id: 0 })
    // console.log(response)
    const data = response[0].invoice.data
    const filePath = path.join(__dirname, '..', 'invoice.pdf');
    const filePath2 = path.join(__dirname, '..', 'invoice2.pdf');
    // console.log(data)
    // fs.writeFileSync(filePath2,data)
    // const data = fs.readFileSync(filePath)
    // if(response.data == data){
    //     console.log(true)
    // }
    if (response) {
        // console.log(response);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="invoice.pdf"');
        res.setHeader('Content-Transfer-Encoding', 'Binary');
        res.send(data)
    }
}
module.exports = { addtoOrder: addtoOrderDb, getOrdersfromDb, getOrderIds, getOrderById ,getInvoice }