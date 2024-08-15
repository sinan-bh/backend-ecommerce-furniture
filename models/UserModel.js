const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  uname: String,
  password: String,
  type: { type: String, default: "user" },
  date: { type: String, default: new Date().toLocaleDateString() },
  cart: [
    {
      prodid: { type: mongoose.Schema.ObjectId, ref: "product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  order: [{ type: mongoose.Schema.ObjectId, unique: true, ref: "order" }],
  wishlist: [{ type: mongoose.Schema.ObjectId, ref: "product" }],
});

module.exports = mongoose.model("users", userSchema);
