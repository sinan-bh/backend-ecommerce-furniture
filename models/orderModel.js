const { default: mongoose } = require("mongoose");
const { payment } = require("../controllers/UserController");

const orderSchema = new mongoose.Schema({
  userID: String,
  products: [{ type: mongoose.Types.ObjectId, ref: "product" }],
  date: { type: String, default: new Date().toLocaleDateString() },
  order_id: String,
  payment_id: String,
  total_ammount: Number,
  status: String,
  payment: {type: String, default: 'pending'},
});

module.exports = mongoose.model("order", orderSchema);
