require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const errHandler = require("./middlewares/errorHandling");
const session = require("express-session")
const UserRoutes = require("./routes/UserRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errHandler);
app.use(session({
  secret: process.env.SECRET_KEY, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 60 * 60 * 1000
  }
}))


const url = process.env.MONGO_URI;

function dbConnection() {
  mongoose.connect(url).then(() => console.log("DataBase Connected"));
}

app.use("/users", UserRoutes);
app.use("/admin", adminRoutes);

module.exports = { app, dbConnection };
