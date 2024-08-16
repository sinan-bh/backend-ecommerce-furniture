const JWT = require("jsonwebtoken");
const isAdmin = async (req, res, next) => {

  console.log(req.headers);
  
  const authHeader = req.headers["authorization"];

  console.log(authHeader);
  

  if (!authHeader) {
    return res
      .status(401)
      .send({ stauts: "failure", message: "no token provaided" });
  }

  const token = authHeader.split(" ")[1];
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
