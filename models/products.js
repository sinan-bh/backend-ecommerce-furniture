const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  type: String,
  category:String,
  Image: String,
  title: String,
  description: String,
  price: String,
  quantity: Number,
  offerPrice: Number,
  details: String,
});

module.exports = mongoose.model("product", productSchema);
