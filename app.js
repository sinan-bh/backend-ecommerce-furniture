const express = require("express");
const errHandler = require('./middlewares/errorHandling')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errHandler)

const getAllUser = require("./routes/UserRoutes");

app.use("/users", getAllUser);

module.exports = app;
