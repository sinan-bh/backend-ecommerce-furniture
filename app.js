require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const errHandler = require("./middlewares/errorHandling");
const cookie = require("cookie-parser")
const UserRoutes = require("./routes/UserRoutes");
const adminRoutes = require("./routes/adminRoutes");
const loginRoutes = require("./routes/loginRoutes");

const app = express();

app.use(cors({
  // origin: 'https://furnicture-e-commerce.vercel.app',
  origin: 'http://localhost:3001',
  credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errHandler);
app.use(cookie())

const url = process.env.MONGO_URI;

function dbConnection() {
  mongoose.connect(url).then(() => console.log("DataBase Connected"));
}

app.use("/login", loginRoutes);
app.use("/users", UserRoutes);
app.use("/admin", adminRoutes);

module.exports = { app, dbConnection };
