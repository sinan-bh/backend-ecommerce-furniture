const { default: mongoose } = require("mongoose");
const userModel = require("../models/UserModel");
const productModel = require("../models/products");
const { use } = require("../routes/UserRoutes");

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

  res
    .status(200)
    .send({ status: "success", message: `Welcome To ${user.uname}` });
};

const getAllProducts = async (req, res) => {
  const data = await productModel.find();

  res.status(200).send(data);
};

const getProductById = async (req, res) => {
  const id = req.params.id;

  const data = await userModel.findById(id);

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

  console.log("hh", cartItem);
  console.log(cartItem.quantity);

  cartItem.quantity += quantityChange;

  if (cartItem.quantity > 0) {
    user.save();
  }

  res
    .status(200)
    .send({ status: "success", message: "cartItem Updated", data: user.cart });
};

module.exports = {
  userRegistration,
  userLogin,
  getAllProducts,
  getProductById,
  addToCart,
  addCartQuantity,
};
