const express = require("express");
const router = express();
const controller = require("../controllers/UserForm");
const isUserLogin = require("../middlewares/userAuthintication");
const tryCatchMiddleware = require('../middlewares/tryCatchErrorHandler')

router.route("/registration").post(tryCatchMiddleware(controller.userRegistration));
router.route("/login").post(tryCatchMiddleware(controller.userLogin));

router.route("/products").get(tryCatchMiddleware(controller.getAllProducts));
router.route("/products/category").get(tryCatchMiddleware(controller.getProductByCategory));
router.route("/products/:id").get(tryCatchMiddleware(controller.getProductById));

router.use(isUserLogin);

router.route("/cart/:id").post(tryCatchMiddleware(controller.addToCart));
router.route("/cart/:id").get(tryCatchMiddleware(controller.viewCart));
router.route("/cart/:id").put(tryCatchMiddleware(controller.addCartQuantity));
router.route("/cart/:id/:itemId").delete(tryCatchMiddleware(controller.removeProduct));

router.route("/wishlist/:id").post(tryCatchMiddleware(controller.addWishList))
router.route("/wishlist/:id").get(tryCatchMiddleware(controller.showWishList))
router.route("/wishlist/:id/:itemId").delete(tryCatchMiddleware(controller.removeFromWishList))

router.route("/payment/:id").post(tryCatchMiddleware(controller.payment))
router.route("/payment/:id").get(tryCatchMiddleware(controller.orederProducts))

module.exports = router;
