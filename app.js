require('dotenv')
const express = require("express");
const errHandler = require('./middlewares/errorHandling')
const session = require('express-session')


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errHandler)
app.use(session({
    secret: process.env.SECRET_KEY, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }))

const UserRoutes = require("./routes/UserRoutes");


app.use("/users", UserRoutes);

module.exports = app;
