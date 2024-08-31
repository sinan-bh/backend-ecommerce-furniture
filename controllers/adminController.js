require("dotenv");
const orderModel = require("../models/orderModel");
const productsModel = require("../models/products");
const UserModel = require("../models/UserModel");
const { productsValidationSchema } = require("../models/validation");


module.exports = {
  // All users
  getAllUsers: async (req, res) => {
    const users = await UserModel.find().sort( { _id: -1 } );

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
    const { category } = req.query;

    if (!category) {
      
      const products = await productsModel.find().sort({ _id : -1 });      
    
      if (!products) {
        return res.status(400).send({ message: "Products Not Found" });
      }
    
      res.status(200).send(products);
    }else{
      const findCategory = await productsModel.aggregate([
        {$match: {category: category},  $sort: { _id : -1 } }
      ]);
    
      if (!findCategory || findCategory.length === 0) {
        return res
          .status(400)
          .send({ status: "failure", message: "Not Found The Category" });
      }
    
      res.status(200).send(findCategory);
    }
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
      return res.status(400).json({status:"faild", error: error });
    }

    const { image,title, description, price, offerPrice, category, details, type, quantity } =
      value;
      
    const newProducts = await productsModel.create({
      image,
      title,
      description,
      price,
      offerPrice,
      category,
      details,
      type,
      quantity,
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
      
    const updateProduct = await productsModel.findByIdAndUpdate(
      { _id: productID },
      {$set: value }
    );

    res.status(200).send({ status: "success", data: value });
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
    const orders = await orderModel.find().populate("products" ).sort({ _id: -1} );

    if (!orders) {
      return res.status(400).res.send({ message: "orders not found" });
    }

    res
      .status(200)
      .send({ status: "success", message: "orders found", data: orders });
  },

  //Order Details By Id
  getOrdersById: async (req, res) => {
    const orderID = req.params.id;
    const order = await orderModel
      .findById(orderID)
      

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

    const purchasedProductLivingroom = orders.filter((item)=> item.products.reduce((total,item)=>  item.category === 'livingroom' ? total + 1 : total ,0)).length
   
    const purchasedProductDiningroom = orders.filter((item)=> item.products.reduce((total, item)=> item.category === 'diningroom' ? total + 1 : total ,0)).length
    
    const purchasedProductBedroom = orders.filter((item)=> item.products.reduce((total, item)=> item.category === 'bedroom' ? total + 1 : total ,0)).length
    

    res
      .status(200)
      .send({
        status: "success",
        message: "order details",
        total_purchase: total_products,
        revanue: total_ammount,
        livingPurchased: purchasedProductLivingroom,
        diningPurchased: purchasedProductDiningroom,
        bedPurchased: purchasedProductBedroom,
      });
  },

  // Order Status Update
  orderStatusUpdate: async (req,res) => {
    const {order_id, status} = req.body
    const order = await orderModel.findById(order_id)

    if (!order) {
      return res.status(400).res.send({ message: "orders not found" });
    }
 
    const updateStatus = await orderModel.updateOne(
      {_id: order_id}, {$set: {status: status}}
    )

    res
      .status(200)
      .send({ status: "success", message: "status updated", data: updateStatus });
  }
};
