const express = require("express");
const router = express();
const controller = require("../controllers/UserForm");

router.route("/registration").post(controller.userRegistration);
router.route("/login").post(controller.userLogin);

router.route("/products").get(controller.getAllProducts);
router.route("/products/:id").get(controller.getProductById);

router.route("/cart/:id").post(controller.addToCart);
router.route("/cart/:id").put(controller.addCartQuantity);

module.exports = router;
