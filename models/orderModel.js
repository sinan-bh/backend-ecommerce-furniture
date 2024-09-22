const { default: mongoose } = require("mongoose");
const { payment } = require("../controllers/UserController");

const orderSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.ObjectId, ref: "users"},
  products: [
    {
      prodid: { type: mongoose.Schema.ObjectId, ref: "product" },
      quantity: { type: Number, default: 1 },
      productPrize: { type: Number}
    },
  ],
  date: { type: String, default: new Date().toLocaleDateString() },
  order_id: String,
  payment_id: String,
  total_ammount: Number,
  status: String,
  payment: {type: String, default: 'pending'},
});

module.exports = mongoose.model("order", orderSchema);
