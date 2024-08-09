const userModel = require("../models/UserModel");

const getAllUser = async (req, res) => {
  const data = await userModel.find();

  res.status(200).send(data);
};

const getUser = async (req, res) => {
  const id = req.params.id;

  const data = await userModel.findById(id);

  res.status(200).send(data);
};

module.exports = { getAllUser, getUser };
