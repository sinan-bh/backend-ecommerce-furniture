const express = require('express')
const tryCatchErrorHandler = require('../middlewares/tryCatchErrorHandler')
const controller = require('../controllers/adminController')
const imageUpload = require('../middlewares/imageUploder/handleImage')
const isAdmin = require('../middlewares/adminAuthentication')
const routes = express()


routes
    .post("/login",tryCatchErrorHandler(controller.adminLogin))

    routes.use(isAdmin)

    .get("/allusers",tryCatchErrorHandler(controller.getAllUsers))
    .get("/user/:id",tryCatchErrorHandler(controller.getUserByID))
    .get("/products",tryCatchErrorHandler(controller.getAllProducts))
    .get("/product/:id",tryCatchErrorHandler(controller.getProductById))
    .post("/products",imageUpload,tryCatchErrorHandler(controller.createProducts))
    .put("/products/:id",imageUpload,tryCatchErrorHandler(controller.updateProduct))
    .delete("/products/:id",tryCatchErrorHandler(controller.deleteProduct))
    .get("/orders",tryCatchErrorHandler(controller.getAllOrders))
    .get("/orders/details",tryCatchErrorHandler(controller.orderDetails))
    .get("/orders/:id",tryCatchErrorHandler(controller.getOrdersById))
    

module.exports = routes