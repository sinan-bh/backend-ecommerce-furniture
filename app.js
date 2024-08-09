const express = require("express");

const app = express();

const getAllUser = require("./routes/UserRoutes");

app.use("/users", getAllUser);

module.exports = app;
