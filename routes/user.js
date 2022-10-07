const express = require('express')
const router = express.Router()
const userController = require("../controllers/controllerUser") 

//setting the user router
router.get('/user', userController.creatingUser)
router.post('/user', userController.creatingUser)

module.exports = router