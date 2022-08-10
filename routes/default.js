const express = require('express')
const router = express.Router()

router.get("/",(req, res)=>{
    res.status(200).send("<h1>bem vindo, esta api é específica para o aplicativo VPSDashBoard</h1>")
})

module.exports = router