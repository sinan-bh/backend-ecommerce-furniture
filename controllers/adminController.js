require("dotenv");
const orderModel = require("../models/orderModel");
const productsModel = require("../models/products");
const UserModel = require("../models/UserModel");
const JWT = require("jsonwebtoken");
const { productsValidationSchema } = require("../models/validation");
const SECRET_KEY = process.env.SECRET_KEY;
const ADMIN_KEY = process.env.ADMIN_KEY;
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

module.exports = {
  //Admin Login
  adminLogin: async (req, res) => {
    const { uname, password } = req.body;

    if (uname === ADMIN_KEY && password === ADMIN_SECRET_KEY) {
      const token = JWT.sign({ usename: uname }, SECRET_KEY, {
        expiresIn: 86400,
      });

      return res.status(200).send({
        status: "success",
        message: "admin Logged",
        token: token,
        data: uname,
      });
    }

    res.status(400).send({ status: "falied", message: "login failed" });
  },

  // All users
  getAllUsers: async (req, res) => {
    const users = await UserModel.find();
    console.log(users);

    if (!users) {
      return res.status(400).res.send({ message: "users not found" });
    }

    res
      .status(200)
      .send({ status: "success", message: "user found", data: users });
  },

  //Get Specific User
  getUserByID: async (req, res) => {
    const userID = req.params.id;
    const user = await UserModel.findById(userID);
    if (!user) {
      return res.status(400).send({ message: "user not found" });
    }
    res
      .status(200)
      .send({ status: "success", message: "user found", data: user });
  },

  //View All Products
  getAllProducts: async (req, res) => {
    const products = await productsModel.find();

    if (!products) {
      return res.status(400).res.send({ message: "products not found" });
    }

    res
      .status(200)
      .send({ status: "success", message: "user found", data: products });
  },

  //View Products By Category
  getProductsByCategory: async (req, res) => {
    const type = req.body.type;
    const products = await productsModel.find();
    if (!products) {
      return res.status(400).res.send({ message: "products not found" });
    }

    const category = products.filter((item) => item.type === type);

    if (!category) {
      return res.status(400).res.send({ message: "products not found" });
    }

    res
      .status(200)
      .send({ status: "success", message: "user found", data: category });
  },

  //View Product By Id
  getProductById: async (req, res) => {
    const productID = req.params.id;
    const product = await productsModel.findById(productID);

    if (!productID) {
      return res.status(400).res.send({ message: "product not found" });
    }

    res
      .status(200)
      .send({ status: "success", message: "user found", data: product });
  },

  // create products
  createProducts: async (req, res) => {
    const { error, value } = productsValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description, price, offerPrice, category, details, type } =
      value;
    const newProducts = await productsModel.create({
      title,
      description,
      price,
      offerPrice,
      category,
      details,
      type,
    });

    res.status(201).json({
      status: "success",
      message: "Successfully Created products .",
      data: newProducts,
    });
  },

  // update product
  updateProduct: async (req, res) => {
    const productID = req.params.id;
    const { error, value } = productsValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { title, description, price, offerPrice, category, details, type } =
      value;
    const updateProduct = await productsModel.findByIdAndUpdate(
      { _id: productID },
      {
        title: title,
        description: description,
        price: price,
        offerPrice: offerPrice,
        category: category,
        details: details,
        type: type,
      }
    );

    res.status(200).send({ status: "success", data: updateProduct });
  },

  // delete product
  deleteProduct: async (req, res) => {
    const productID = req.params.id;
    const product = await productsModel.findByIdAndDelete({ _id: productID });

    if (!product) {
      res.status(400).send({ message: "products not find" });
    }

    res
      .status(200)
      .send({ status: "success", message: "product deleted", data: product });
  },

  //Order Details
  getAllOrders: async (req, res) => {
    const orders = await orderModel.find().populate({ path: "products" });

    if (!orders) {
      return res.status(400).res.send({ message: "orders not found" });
    }

    res
      .status(200)
      .send({ status: "success", message: "user found", data: orders });
  },

  //Order Details By Id
  getOrdersById: async (req, res) => {
    const orderID = req.params.id;
    const order = await orderModel
      .findById(orderID)
      .populate({ path: "products" });

    if (!order) {
      return res.status(400).res.send({ message: "orders not found" });
    }

    res
      .status(200)
      .send({ status: "success", message: "order found", data: order });
  },

  // total purchase and total revanue
  orderDetails: async (req, res) => {
    const orders = await orderModel.find().populate({ path: "products" });

    if (!orders) {
      return res.status(400).res.send({ message: "orders not found" });
    }
    const total_products = orders.length;
    const total_ammount = orders.reduce(
      (total, item) => total + item.total_ammount,
      0
    );

    res
      .status(200)
      .send({
        status: "success",
        message: "order details",
        total_products: total_products,
        revanue: total_ammount,
      });
  },
};
