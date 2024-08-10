const express = require("express");
const router = express();
const controller = require("../controllers/UserForm");


router.route("/registration").post(controller.userRegistration)
router.route("/users").get(controller.getAllUser);
router.route("/users/:id").get(controller.getUser);

router.route("/cart").patch(controller.addToCart)

module.exports = router;
