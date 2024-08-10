const mongoose = require('mongoose');
const { schema } = require('./UserModel');


const productSchema = new mongoose.Schema({
    type:String,
    Image:String,
    imageCategory:String,
    description:String,
    price:String,
    quantity:Number,
    offerPrice:Number,
    details:String,
})

module.exports = mongoose.model("product",productSchema)