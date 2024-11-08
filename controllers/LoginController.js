
const userModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { userValidationSchema } = require("../models/validation");
const bcrypt = require("bcrypt");

const SECRET_KEY = process.env.SECRET_KEY;
const ADMIN_KEY = process.env.ADMIN_KEY;
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;



const loginPage = async (req, res) => {
    const { error, value } = userValidationSchema.validate(req.body);
  
    console.log(error);
  
    if (error) {
      return res
        .status(400)
        .send({ status: "error", message: "login details incorrect" });
    }
  
    console.log("login", value);
  
    const { userName, pass } = value;

    if (userName === ADMIN_KEY && pass === ADMIN_SECRET_KEY) {

      const token = jwt.sign({ usename: userName }, SECRET_KEY, {
        expiresIn: 86400,
      });

      res.cookie('token', token, {
        httpOnly: true, 
        secure: true, 
        sameSite: 'none', 
        maxAge: 3600000, 
      });

      return res.status(200).send({
        status: "success",
        message: "admin Logged",
        token: token,
        data: userName,
      });
    }

    const user = await userModel.findOne({ userName: userName });
    
    if (!user) {
      return res
        .status(400)
        .send({ status: "error", message: "Invalid User Name or Password" });
    }
  
    if (!pass || !user.password) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid User Name or Password" });
    }
  
    const isPasswrodMatch = await bcrypt.compare(pass, user.password);
    
    if (!isPasswrodMatch) {
      return res
        .status(400)
        .send({ status: "error", message: "Invalid User Name or Password", isPasswrodMatch });
    }
  
    const token = jwt.sign({ username: user.userName }, SECRET_KEY, {
      expiresIn: 3600,
    });
  
    res.cookie('token', token, {
      httpOnly: true, 
      secure: true, 
      sameSite: 'none', 
      maxAge: 3600000, 
    });
  
    res.status(200).send({
      status: "success",
      message: `Welcome To ${user.userName}`,
      token: token,
      userName,
      user,
      isPasswrodMatch,
    });
  };
  
  module.exports = {loginPage}