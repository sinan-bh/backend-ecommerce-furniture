const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getAllUser = require("./routes/UserRoutes");

app.use("/users", getAllUser);

module.exports = app;
