require("dotenv").config();


const {app, dbConnection} = require("./app");
const PORT = process.env.PORT || 3000;


dbConnection();


app.listen(PORT, () => console.log(`server is up on ${PORT}`));
