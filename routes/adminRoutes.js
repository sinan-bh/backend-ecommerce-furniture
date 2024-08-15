const express = require('express')
const tryCatchErrorHandler = require('../middlewares/tryCatchErrorHandler')
const controller = require('../controllers/adminController')
const routes = express()


routes
    .post("/login",tryCatchErrorHandler(controller.adminLogin))
    .get("/allusers",tryCatchErrorHandler(controller.getAllUsers))
    .get("/user/:id",tryCatchErrorHandler(controller.getUserByID))
    .get("/products",tryCatchErrorHandler(controller.getAllProducts))
    .get("/products/category",tryCatchErrorHandler(controller.getProductsByCategory))
    .get("/product/:id",tryCatchErrorHandler(controller.getProductById))
    .post("/products",tryCatchErrorHandler(controller.createProducts))
    .put("/products/:id",tryCatchErrorHandler(controller.updateProduct))
    .delete("/products/:id",tryCatchErrorHandler(controller.deleteProduct))
    .get("/orders",tryCatchErrorHandler(controller.getAllOrders))
    .get("/orders/details",tryCatchErrorHandler(controller.orderDetails))
    .get("/orders/:id",tryCatchErrorHandler(controller.getOrdersById))
    

module.exports = routes