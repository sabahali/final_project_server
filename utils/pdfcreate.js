const { userModel, orderModel } = require('../mongodbControllers/models')
const fs = require('fs');
const PDFDocument = require('pdfkit');
const moment = require("moment");
const { error } = require('console');
function getIndianFormat(str) { 
    str = str.split(".");
    return str[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") + (str[1] ? ("."+str[1]): "");
   }
let checkoutItems , address , state, city,zip ,email,order_id;

const invoice = '';
const generatepdfInvoice = async(req, res, next) => {
    console.log(req.body)
    const { checkoutItems , order_id : orderID, address : addr, statec : statee, city:cityy, zip : zipp } = req.body;
    const found = checkoutItems.find((item) => item)
    const emaill = found.email;
    // checkoutItems = checks;
    order_id = orderID;
    address = addr;
    state = statee;
    city = cityy;
    zip = zipp;
    email = emaill;


    createInvoice(invoice, 'invoice.pdf').then(()=>{
        next()
    }).catch((Err)=>{
        console.log(Err)
    })



async function createInvoice(invoice, path) {
    let doc = new PDFDocument({ margin: 50 });
 return new Promise((resolve, reject) => {
    generateHeader(doc); // Invoke `generateHeader` function.
    generateCustomerInformation(doc)
    generateInvoiceTable(doc)
    generateFooter(doc); // Invoke `generateFooter` function.

    doc.end();
    doc.pipe(fs.createWriteStream(path))
    .on('finish',()=>{
        resolve()
    }).on('error',()=>{
        reject(error)
    })
    
})


   

}

function generateHeader(doc) {

    doc.fillColor('#444444')
        .fontSize(20)
        .text('E-commerce', 50, 65, { align: 'left' })
        .fontSize(10)
        .text('Founder : Sabah Ali Ck', 50, 100, { align: 'left' })
        .text('Kerala', 50, 120, { align: 'left' })
        .moveDown();
}
function generateFooter(doc) {
    doc.fontSize(
        10,
    ).text(
        'Payment is Successfull. Thank you !.',
        50,
        700,
        { align: 'center', width: 500 },
    ).text(
        'Visit Again !.',
        50,
        720,
        { align: 'center', width: 500 },
    )
}
function generateCustomerInformation(doc) {


    doc.text(`Order ID: ${order_id}`, 50, 200)
        .text(`Invoice Date: ${new Date().toDateString()}`, 50, 215)

        .text("Shipping Address :",400,200)
        .text(email, 400, 215)
        .text(address, 400, 230)
        .text(
            `${city}, ${state},${zip}, India`,
            400,
            240,
        )
        .moveDown();
}

function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
    doc.fontSize(10)
        .text(c1, 50, y)
        .text(c2, 230, y)
        .text(c3, 280, y, { width: 90, align: 'right' })
        .text(c4, 370, y, { width: 90, align: 'right' })
        .text(c5, 0, y, { align: 'right' });
}
function generateInvoiceTable(doc) {
    let i,
        invoiceTableTop = 330;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Quantity",
        "Unit Price",
        "Total Price"
    );
    generateHr(doc,350)
    let yposition ;
    let totalAmount = 0;
    checkoutItems.forEach((item, i) => {
        const position = invoiceTableTop + (i + 1) * 30;
        yposition = position 
        totalAmount +=item.price * item.count
        generateTableRow(
            doc,
            position,
            item.title,
            item.count,
            item.price,
            item.price * item.count,
        );
    });
    generateHr(doc,yposition + 30)
    doc.text("Total Amount Paid :",280,yposition + 30 +30)
    .text(`${totalAmount} Rs`,420,yposition + 30 +30)

}
function generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }
//   if (found && order_id ) {
//     const date = moment().format("MM/DD/YYYY HH:mm:ss")
//     const response = await orderModel.insertMany({ order: checkoutItems, email: email, order_id, date });
//     if (response) {
//         res.sendStatus(201)
//     }
// }
}
module.exports = { generatepdfInvoice }