const express = require('express')
const router = express.Router()
const userController = require("../controllers/user/controllerUser") 
const auth = require("../middlewares/auth.js")

// using jwt authentication in this route
// we send a token to user and save in asyncStorage

// o usuario vai fazer o cadastro, logo depois será mostrado na tela de solicitação
// mudando ativo para true, o usuario tera acesso ao app, se nao, nao

//setting the user router
router.get('/user', auth, userController.getUser) //user wil make this request to access the ap
router.get('/userAdm', userController.getUser) // adm request
router.post('/user', userController.creatingUser) // user registration
router.put('/user/:id', userController.updatingUser) // user update
router.delete('/user/:id', userController.deleteUser) // user delete
// router.put('/user', )

module.exports = router