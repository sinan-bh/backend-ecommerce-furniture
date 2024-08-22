require("dotenv");
const { default: mongoose } = require("mongoose");
const userModel = require("../models/UserModel");
const productModel = require("../models/products");
const jwt = require("jsonwebtoken");
const { userValidationSchema } = require("../models/validation");
const bcrypt = require("bcrypt");
const Razorpay = require("razorpay");
const orderModel = require("../models/orderModel");
const crypto = require('crypto')

const SECRET_KEY = process.env.SECRET_KEY;
const RAZORPAY_KEY = process.env.razorpay_key_id;
const RAZORPAY_SECRET_KEY = process.env.razorpay_secert_key;

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

// registration
const userRegistration = async (req, res) => {
  const { error, value } = userValidationSchema.validate(req.body);
  console.log("registrationError", error);

  if (error) {
    return res.status(400).send({
      status: "failure",
      message: "invalid user datas",
      error: error.message,
    });
  }

  console.log("registration", value);

  const { name, email, uname, pass } = value;
  const password = await bcrypt.hash(pass, 10);
  const newUser = new userModel({ name, email, uname, password });
  const user = await userModel.find();
  const username = user.find((item) => item.uname === uname);

  console.log("username", username);

  if (username) {
    return res.status(400).send({ message: "username exist" });
  }

  newUser.save();
  res.status(201).send(newUser);
};

// login
const userLogin = async (req, res) => {
  const { error, value } = userValidationSchema.validate(req.body);

  console.log(error);

  if (error) {
    return res
      .status(400)
      .send({ status: "failure", message: "login details incorrect" });
  }

  console.log("login", value);

  const { uname, pass } = value;
  const user = await userModel.findOne({ uname: uname });

  console.log("user", user);

  if (!user) {
    return res
      .status(400)
      .send({ status: "failure", message: "user not found" });
  }

  if (!pass || !user.password) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid password" });
  }

  const isPasswrodMatch = await bcrypt.compare(pass, user.password);

  console.log("passss", isPasswrodMatch);

  if (!isPasswrodMatch) {
    return res
      .status(400)
      .send({ message: "invalid password", isPasswrodMatch });
  }

  const token = jwt.sign({ username: user.uname }, SECRET_KEY, {
    expiresIn: 86400,
  });


  res.status(200).send({
    status: "success",
    message: `Welcome To ${user.uname}`,
    token: token,
    uname,
    user,
    isPasswrodMatch,
  });
};

// get products
const getAllProducts = async (req, res) => {
  const { category } = req.query;

  if (!category) {
    
    const products = await productModel.find();
  
    if (!products) {
      return res.status(400).send({ message: "Products Not Found" });
    }
  
    res.status(200).send(products);
  }else{
    const findCategory = await productModel.aggregate([
      {$match: {category: category}}
    ]);
  
    if (!findCategory || findCategory.length === 0) {
      return res
        .status(400)
        .send({ status: "failure", message: "Not Found The Category" });
    }
  
    res.status(200).send(findCategory);
  }
};


// products by id
const getProductById = async (req, res) => {
  const id = req.params.id;
  const data = await productModel.findById(id);

  if (!data) {
    return res
      .status(400)
      .send({ status: "failure", message: "Products Not Found" });
  }

  res.status(200).send(data);
};

// add to cart
const addToCart = async (req, res) => {
  const userID = req.params.id;
  const productID = req.body.id;
  const user = await userModel.findById(userID);

  console.log("user", user);

  if (!user) {
    return res.status(400).send({ error: "Invalid User" });
  }

  const isUserProduct = user.cart.find(
    (item) => item.prodid.toString() === productID
  );

  if (isUserProduct) {
    return res
      .status(400)
      .send({ status: "failure", message: "Product is Already Added" });
  }

  await userModel.updateOne(
    { _id: userID },
    { $addToSet: { cart: { prodid: productID } } }
  );

  const cartLength = user.cart.length

  res.send({
    status: "Success",
    message: "Successfully Added Product to Cart",
    cartLength: cartLength
  });
};

// view cart
const viewCart = async (req, res) => {
  const userID = req.params.id;
  const cartItem = await userModel
    .findById(userID)
    .populate({ path: "cart.prodid" });

  if (!cartItem) {
    return res
      .status(400)
      .send({ status: "failure", message: "Products Not added To cart" });
  }

  res.status(200).send(cartItem.cart);
};

//  update quantity
const addCartQuantity = async (req, res) => {
  const userID = req.params.id;  
  const { prodid, quantityChange } = req.body;    
  const user = await userModel.findById(userID).populate({path:"cart"})
      
  if (!user) {
    res.status(400).send({ status: "failure", message: "user not found" });
  }
  
  const cartItem = user.cart.find((item) => item.prodid.toString() === prodid);
  

  if (!cartItem) {
    res
      .status(400)
      .send({ status: "failure", message: "Cart items not found" });
  }

  cartItem.quantity += quantityChange;

  if (cartItem.quantity > 0) {
    user.save();
  }

  res
    .status(200)
    .send({ status: "success", message: "cartItem Updated", data: user.cart });
};

// remove Products
const removeProduct = async (req, res) => {
  const userID = req.params.id;
  const itemId = req.params.itemId;

  if (!itemId) {
    return res.status(400).send({ message: "Products Not Found" });
  }

  const user = await userModel.findById(userID);

  if (!user) {
    return res.status(404).send({ message: "User Not Found" });
  }

  const result = await userModel.updateOne(
    { _id: userID },
    { $pull: { cart: { prodid: itemId } } }
  );

  if (result.modifiedCount > 0) {
    res.status(200).send({ status: "sucess", message: "cart product removed" });
  }
};

// add wish list
const addWishList = async (req, res) => {
  const userID = req.params.id;

  if (!userID) {
    return res.status(400).send({ messge: "user not found" });
  }

  const productID = req.body.id;
  const product = await userModel.findOne({ _id: userID, wishlist: productID });

  console.log(product);

  if (product) {
    return res.status(400).send({ message: "The Product All ready Exist" });
  }

  const whishList = await userModel.updateOne(
    { _id: userID },
    { $push: { wishlist: productID } }
  );

  res.status(200).send({
    type: "success",
    message: "add wishlist to product",
    data: whishList,
  });
};

// view wishlist
const showWishList = async (req, res) => {
  const userID = req.params.id;

  if (!userID) {
    return res.status(400).send({ message: "User Not Found" });
  }

  const whishList = await userModel.findById(userID).populate("wishlist");

  if (!whishList) {
    return res.status(400).send({ message: "WhisList is Empty" });
  }

  res.status(200).send({ status: "success", data: whishList.wishlist });
};

// remove wishlist
const removeFromWishList = async (req, res) => {
  const userID = req.params.id;
  const itemID = req.params.itemId;

  console.log("userID", userID);
  console.log("ItemID", itemID);

  if (!userID && !itemID) {
    return res.status(400).send({ message: "user or product not found" });
  }

  const removeProduct = await userModel.updateOne(
    { _id: userID },
    { $pull: { wishlist: itemID } }
  );

  console.log(removeProduct);

  res.status(200).send({
    status: "success",
    message: "remove the product in wishList",
    data: removeProduct,
  });
};

// order product
const payment = async (req, res) => {
  const userID = req.params.id;
  const user = await userModel
    .findById(userID)
    .populate({ path: "cart.prodid" });

  const { cart } = user;
  const quantity = cart.reduce((total, item) => total + item.quantity, 0);
  const amount = cart
    .map((item) => item.prodid)
    .reduce((total, data) => (total + Math.round(data.offerPrice)) * quantity, 0);

  const option = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Math.floor(Math.random() * 10000)}`,
  };
  
  const order = await razorpay.orders.create(option);

  console.log(order);
  
  
  if (!order) {
    return res.status(400).send({ message: "some thing wrong" });
  }  

  const products = user.cart;
  const { id, created_at } = order;
  const order_id = id;
  const total_ammount = amount;  

    const newOrder = new orderModel({
    userID,
    products,
    order_id,
    status: 'pending',
    total_ammount,
  });

  newOrder.save();

  res.cookie('paymentOrder', { userID, products, order_id, total_ammount }, { maxAge: 900000, httpOnly: true });

  console.log( req.cookies.paymentOrder);
  

  res
    .status(201)
    .send({ status: "success", message: "payment success", order:  { userID, products, order_id, total_ammount }});
};

// verify product
const verify_payment = async (req, res) => {
  const id = req.params.id; 
  const { order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const generatedSignature = crypto
    .createHmac('sha256', RAZORPAY_SECRET_KEY)
    .update(`${order_id}|${razorpay_payment_id}`)
    .digest('hex');    

  if (generatedSignature === razorpay_signature) {
    console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhh');
    const order = await orderModel.findOne({order_id: order_id})

    await orderModel.updateOne(
      {order_id: order_id},{$set: {status: 'completed'}}
    )
    
    await userModel.updateOne(
      { _id: id },
      {  $push: {order: order}, $set: { cart: [] }, },
      { new: true }
    );
    
    res.send('Payment verified successfully');
  } else {
    res.status(400).send('Payment verification failed');
  }

};

// cancell order
const cancellProduct = async (req,res) => {
  res.status(200).send({status: "success", message: "order cancelled"})
}

// order produc details
const orederProducts = async (req, res) => {
  const userID = req.params.id;
  const user = await userModel.findById(userID).populate('order');

  console.log(user);
  

  // if (user.order.length === 0) {
  //   return res.status(400).send({ message: "order not found" });
  // }
  res.status(200).send({ status: "success", data: user });
};


module.exports = {
  userRegistration,
  userLogin,

  getAllProducts,
  getProductById,

  addToCart,
  viewCart,
  addCartQuantity,
  removeProduct,

  addWishList,
  showWishList,
  removeFromWishList,

  payment,
  verify_payment,
  cancellProduct,
  orederProducts,
};
