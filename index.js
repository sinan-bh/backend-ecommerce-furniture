require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 6000;
const url = process.env.MONGO_URI;

function dbConnection() {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DataBase Connected"));
}

dbConnection();

app.listen(PORT, () => console.log(`server is up on ${PORT}`));
