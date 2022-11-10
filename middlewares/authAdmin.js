const jwt = require('jsonwebtoken')
require("dotenv").config()

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"]

    if(!token){
        return res.status(403).send({error: "token é necessário"})
    }

    try{
        const decode = jwt.verify(token, process.env.TOKEN_Key_ADMIN)
        console.log(decode)
        req.admin = decode
    }catch(err){
        return res.status(401).send({error: "Invalid Token"})
    }

    return next()
}

module.exports = verifyToken