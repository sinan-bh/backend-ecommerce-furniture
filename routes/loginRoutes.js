const express = require("express");
const router = express();
const controller = require("../controllers/LoginController");
const tryCatchMiddleware = require('../middlewares/tryCatchErrorHandler')

router.route("/").post(tryCatchMiddleware(controller.loginPage))

module.exports = router