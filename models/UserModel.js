const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  userName: String,
  password: String,
  type: { type: String, default: "user" },
  date: { type: String, default: new Date().toLocaleDateString() },
  cart: [
    {
      prodid: { type: mongoose.Schema.ObjectId, ref: "product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  order: [
    {
      product: [{ type: mongoose.Schema.ObjectId, ref: "product" }],
      status: { type: String, default: "pending" },
      date: { type: String, default: new Date().toLocaleDateString() },
      order_id: String,
      payment_id: String,
      total_ammount: Number,
    },
  ],
  wishlist: [{ type: mongoose.Schema.ObjectId, ref: "product" }],
});

module.exports = mongoose.model("users", userSchema);
