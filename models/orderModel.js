const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema({
  userID: String,
  products: [{ type: mongoose.Types.ObjectId, ref: "product" }],
  date: { type: String, default: new Date().toLocaleDateString() },
  order_id: String,
  total_ammount: Number,
});

module.exports = mongoose.model("order", orderSchema);
