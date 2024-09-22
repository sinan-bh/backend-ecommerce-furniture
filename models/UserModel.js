const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  userName: String,
  password: String,
  type: { type: String, default: "user" },
  date: { type: String, default: new Date().toLocaleDateString() },
  phone: {type: String},
  address: {type: String},
  cart: [
    {
      prodid: { type: mongoose.Schema.ObjectId, ref: "product" },
      quantity: { type: Number, default: 1 },
      productPrize: { type: Number}
    },
  ],
  order: [
    {
       type: mongoose.Schema.ObjectId, ref: "order" ,
    },
  ],
  wishlist: [{ type: mongoose.Schema.ObjectId, ref: "product" }],
});

module.exports = mongoose.model("users", userSchema);
