const mongoose = require("mongoose")

const popularProductsSchema = new mongoose.Schema({
    image: String,
    name: String,
    to: String,
})

module.exports = mongoose.model("popularProducts", popularProductsSchema)