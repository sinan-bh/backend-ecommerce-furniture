require("dotenv");
const { default: mongoose } = require("mongoose");
const userModel = require("../models/UserModel");
const productModel = require("../models/products");
const jwt = require("jsonwebtoken");
const validationSchema = require("../models/validation");

const SECRET_KEY = process.env.SECRET_KEY;

const userRegistration = async (req, res) => {
  const { error, value } = validationSchema.validate(req.body);
  console.log("registrationError", error);

  if (error) {
    return res
      .status(400)
      .send({ status: "failure", message: "invalid user datas" });
  }

  console.log("registration", value);

  const { name, email, uname, pass } = value;
  const newUser = new userModel({ name, email, uname, pass });
  const user = await userModel.find();
  const username = user.find((item) => item.uname === uname);

  console.log("username", username);

  if (username) {
    return res.status(400).send({ message: "username exist" });
  }

  newUser.save();
  res.status(201).send(newUser);
};

const userLogin = async (req, res) => {
  const { error, value } = validationSchema.validate(req.body);

  console.log(error);

  if (error) {
    return res
      .status(400)
      .send({ status: "failure", message: "login details incorrect" });
  }

  console.log(value);

  const { uname, pass } = value;
  const user = await userModel.findOne({ uname: uname });

  if (uname !== user.uname && pass !== user.pass) {
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
    uname,
  });
};

const getAllProducts = async (req, res) => {
  const products = await productModel.find();

  if (!products) {
    return res.status(400).send({ message: "Products Not Found" });
  }

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

  console.log("user", user);

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
  const cartItem = await userModel.findById(userID).populate({ path: 'cart.prodid'});

  if (!cartItem) {
    return res
      .status(400)
      .send({ status: "failure", message: "Products Not added To cart" });
  }

  res.status(200).send(cart);
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

const addWishList = async (req, res) => {
  const userID = req.params.id;

  if (!userID) {
    return res.status(400).send({ messge: "user not found" });
  }

  const productID = req.body.prodid;
  const product = await userModel.findOne({ _id: userID, wishlist: productID });

  console.log(product);
  

  if (product) {
    return res.status(400).send({ message: "The Product All ready Exist" });
  }

  const whishList = await userModel.updateOne(
    { _id: userID },
    { $push: { wishlist: productID } }
  );

  
  res
    .status(200)
    .send({
      type: "success",
      message: "add wishlist to product",
      data: whishList,
    });
};

const showWishList = async (req,res) => {
  const userID = req.params.id

  if (!userID) {
    return res.status(400).send({message: "User Not Found"})
  }

  const whishList = await userModel.findById(userID).populate('wishlist')
  
  if (!whishList) {
    return res.status(400).send({message: "WhisList is Empty"})
  }
  
  res.status(200).send({status: "success", data: whishList})  
}

const removeFromWishList = async (req,res) => {
  const userID = req.params.id
  const itemID = req.params.itemId

  console.log("userID",userID);
  console.log("ItemID",itemID);

  
  if (!userID && !itemID) {
    return res.status(400).send({message: "user or product not found"})
  }

  const removeProduct = await userModel.updateOne({_id: userID},{$pull: {wishlist: itemID}})

  console.log(removeProduct);


  res.status(200).send({status: "success", message: "remove the product in wishList", data:removeProduct})
}

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

  addWishList,
  showWishList,
  removeFromWishList,
};
