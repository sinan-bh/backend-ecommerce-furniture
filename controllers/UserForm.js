require("dotenv");
const { default: mongoose } = require("mongoose");
const userModel = require("../models/UserModel");
const productModel = require("../models/products");
const jwt = require("jsonwebtoken");
const { use } = require("../app");
const SECRET_KEY = process.env.SECRET_KEY;

const userRegistration = async (req, res) => {
  console.log(req.body);
  const { name, email, uname, pass1, pass2 } = req.body;

  if (!name || !email || !uname || !pass1 || !pass2) {
    res.status(404);
  } else {
    const newUser = new userModel({ name, email, uname, pass1, pass2 });

    newUser.save();

    res.status(201).send(newUser);
  }
};

const userLogin = async (req, res) => {
  const { lname, lpass } = req.body;

  const user = await userModel.findOne({ uname: lname });

  if (lname !== user.uname && lpass !== user.pass1) {
    return res
      .status(400)
      .send({ status: "failure", message: "user name or password not match" });
  }

  const token = jwt.sign({ username: user.uname }, SECRET_KEY, {
    expiresIn: 8400,
  });
  res.status(200).send({
    status: "success",
    message: `Welcome To ${user.uname}`,
    data: token,
    lname,
  });
};

const getAllProducts = async (req, res) => {
  const data = await productModel.find();

  res.status(200).send(data);
};

const getProductByCategory = async (req, res) => {
  const { type } = req.body;

  const products = await productModel.find();
  const category = products.filter((item) => item.type === type);

  if (!category) {
    return res
      .status(400)
      .send({ status: "failure", message: "Not Found The Category" });
  }

  res.status(200).send(category);
};

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

const addToCart = async (req, res) => {
  const userID = req.params.id;
  const productID = req.body.prodid;

  const user = await userModel.findById(userID);

  console.log("kkkk", user);

  if (
    !mongoose.Types.ObjectId.isValid(userID) &&
    !mongoose.Types.ObjectId.isValid(productID)
  ) {
    return res.status(400).send({ error: "Invalid User or Product" });
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

  res.send({
    status: "Success",
    message: "Successfully Added Product to Cart",
  });
};

const viewCart = async (req, res) => {
  const userID = req.params.id;
  const user = await userModel.findById(userID);
  const cartItem = user.cart;

  const cart = cartItem.find((item) => item._id);

  if (!cartItem) {
    return res
      .status(400)
      .send({ status: "failure", message: "Products Not added To cart" });
  }
  const products = await productModel.findById(cart.prodid);

  const quantity = cart.quantity;

  const { image, imageCategory, price, offerPrice } = products;
  const data = { image, imageCategory, price, offerPrice, quantity };

  res.status(200).send(data);
};

const addCartQuantity = async (req, res) => {
  const userID = req.params.id;
  const { prodid, quantityChange } = req.body;

  const user = await userModel.findById(userID);

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

module.exports = {
  userRegistration,
  userLogin,
  getAllProducts,
  getProductByCategory,
  getProductById,
  addToCart,
  viewCart,
  addCartQuantity,
  removeProduct,
};
