const jwt = require("jsonwebtoken");

const isUserLogin = (req, res, next) => {
  const token = req.cookies.token;    

  if (!token) {
    return res.status(401).send({ status: "failure", message: "No token provided" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send({ status: "failure", message: "Token expired" });
      } else {
        return res.status(401).send({ status: "failure", message: "User authentication failed" });
      }
    }

    req.uname = decode.uname;  
    next();
  });
};

module.exports = isUserLogin;
