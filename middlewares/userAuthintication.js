const jwt = require('jsonwebtoken');



const isUserLogin = (req,res,next) => {
    const authHeader = req.headers["authorization"]

    if (!authHeader) {
        res.status(401).send({stauts: "failure", message: "no token provaided"})
    }

    let token = authHeader.split(" ")[1];

    jwt.verify(token,process.env.SECRET_KEY,(err,decode)=>{
        if(err){
           return res.status(500).send({status: 'failure', message: "Authintication Faild"})
        }

        req.uname = decode.uname
        next()
    })


}

module.exports = isUserLogin