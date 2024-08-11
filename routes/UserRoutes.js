const express = require("express");
const router = express();
const controller = require("../controllers/UserForm");
const isUserLogin = require('../middlewares/userAuthintication')


router.route("/registration").post(controller.userRegistration);
router.route("/login").post(controller.userLogin);

router.use(isUserLogin)
router.route("/products").get(controller.getAllProducts);
router.route("/products/category").get(controller.getProductByCategory);
router.route("/products/:id").get(controller.getProductById);

router.route("/cart/:id").post(controller.addToCart);
router.route("/cart/:id").get(controller.viewCart);
router.route("/cart/:id").put(controller.addCartQuantity);
router.route("/cart/:id/:itemId").delete(controller.removeProduct);

module.exports = router;

