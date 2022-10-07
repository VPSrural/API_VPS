const express = require('express')
const router = express.Router()
const userController = require("../controllers/controllerUser") 
const auth = require("../middlewares/auth.js")

// using jwt authentication in this route
// we send a token to user and save in asyncStorage
// when 


//setting the user router
router.get('/user', auth, userController.getUser)
router.post('/user', userController.creatingUser)
// router.put('/user', )

module.exports = router