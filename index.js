require("dotenv").config();
const express = require("express");


const mongoose = require("mongoose");
const app = require("./app");



const PORT = process.env.PORT || 4000;
const url = process.env.MONGO_URI;


function dbConnection() {
  mongoose.connect(url).then(() => console.log("DataBase Connected"));
}

dbConnection();

app.listen(PORT, () => console.log(`server is up on ${PORT}`));
