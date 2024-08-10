const userModel = require("../models/UserModel");

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

const getAllUser = async (req, res) => {
  const data = await userModel.find();

  res.status(200).send(data);
};

const getUser = async (req, res) => {
  const id = req.params.id;

  const data = await userModel.findById(id);

  res.status(200).send(data);
};

const addToCart = async (req,res) => {
    const cart = req.body.cart;
    

    if (!cart) {
        res.status(404)
    }else{
        const newCart = new userModel({cart})

        res.send(newCart[id])
    }
}

module.exports = { getAllUser, getUser, userRegistration,addToCart };
