const mongoose = require("mongoose");


// const cartSchema = new mongoose.Schema({
//    prodid: { type: mongoose.Schema.ObjectId, ref:"product" },
//    quantity:{type:Number, default: 1}
// })

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  uname: String,
  pass1: String,
  pass2: String,
  type: String,
  date: Date,
  cart: [{prodid: { type: mongoose.Schema.ObjectId, ref:"product" },
    quantity:{type:Number, default: 1}}],
  order: Object,
});



module.exports = mongoose.model("users", userSchema);
