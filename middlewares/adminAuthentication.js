const JWT = require("jsonwebtoken");
const isAdmin = async (req, res, next) => {
  
  const token = req.cookies.token; 

  if (!token) {
    return res
      .status(401)
      .send({ stauts: "failure", message: "no token provaided" });
  }

  JWT.verify(token, process.env.SECRET_KEY, (err, decode) => {
    if (err) {
      return res
        .status(500)
        .send({ status: "failure", message: "Authintication Faild" });
    }

    req.uname = decode.uname;
    next();
  });
};

module.exports = isAdmin
