const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  uname: String,
  pass1: String,
  pass2: String,
  type: String,
  date: Date,
  cart: Object,
  order: Object,
});

module.exports = mongoose.model("users", userSchema);
