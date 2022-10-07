const jwt = require('jsonwebtoken')

// params -> /{id}
// query -> ?eaeae=toptop&aaaa=salve

// That is, it runs the code below next() after all middleware function finished.
// However, if you use return next(), it will jump out
// the callback immediately and the code below
// return next() in the callback will be unreachable.

const verifyToken = (req, res, next) => {
    // verify if the token comes in the body, query or header request
    const token = req.body.token || req.query.token || req.headers["x-access-token"]

    if(!token){
        return res.status(403).send({error: "token é necessário"})
    }

    try{
        //decode the user if the token exist
        const decoded = jwt.verify(token, process.env.TOKEN_key)
        req.user = decoded;
    }catch(err){
        return res.status(401).send({error: "Invalid Token"})
    }
    return next()
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2MzQwNDczOGVmMjU5YTkwOTYyYmQxMjgiLCJ1c2VybG9naW4iOiJhc2Rhc2Rhc2QiLCJpYXQiOjE2NjUxNTY5MjB9.qlmsXfCrRbcZf-PApctASs_RwLIzzoGx_csocaJvBjU

module.exports = verifyToken