const express = require('express')
const router = express.Router()
const userController = require("../controllers/controllerUser") 
const auth = require("../middlewares/auth.js")

// using jwt authentication in this route
// we send a token to user and save in asyncStorage
// when 

// o usuario vai fazer o cadastro, logo depois será mostrado na tela de solicitação
// mudando ativo para true, o usuario tera acesso ao app, se nao, nao

//setting the user router
router.get('/user', auth, userController.getUser)
router.get('/userAdm', userController.getUser)
router.post('/user', userController.creatingUser)
router.put('/user/:id', userController.updatingUser)
router.delete('/user/:id', userController.deleteUser)
// router.put('/user', )

module.exports = router