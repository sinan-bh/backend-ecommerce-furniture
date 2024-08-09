const express = require("express");
const router = express();
const controller = require("../controllers/UserForm");

router.route("/users").get(controller.getAllUser);
router.route("/users/:id").get(controller.getUser);

module.exports = router;
