const express = require('express')
const db = require('../../models/connetion') // connection environment
const userModel = require('../../models/user/user')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

module.exports.getUser = async (req, res) => {
    res.setHeader("Content-Type", "application/json")
    if(db()){
        try{

            const result = await userModel
            .find({})
            .exec()
    
            res.status(200).send(result)

        }catch(err){

            res.status(400).send({error: err})
        
        }
    }else {
        res.status(404).json({error: "Database não encontrada"})        
    }
}

// we need to set return after send something to the client
module.exports.creatingUser = async (req, res) => {
    res.setHeader("Content-type", "application/json")
    if(db()){

        try{
            const idAlpha = req.body.idAlphaExpress
            const login = req.body.login
            const password = md5(req.body.password)

            // force error if the require fields weren't setted
            if(!(login && password && idAlpha)){
                res.status(400).json({message: "Login, password e idAlpha sao requeridos"})
                return
            }

            const verifyUser = await userModel.findOne({login})
            
            // verify user
            if(verifyUser){
                res.status(409).send({error: "usuario já existe"})
                return
            }
            
            const userToInsert = await userModel.create({
                idAlphaExpress: idAlpha,
                login: login,
                password: password,
            })

            // creating token
            const token = jwt.sign({
                userid: userToInsert._id, 
                userlogin: userToInsert.login
            },
            process.env.TOKEN_KEY)

            // inserting token to user save
            // the token doesn't go to the DB
            userToInsert.token = token

            res.status(200).send(userToInsert)
        }catch(err){

            res.status(400).json({error: err})
        }

    }else{
        res.status(404).json({error: "Database não encontrada"})
    }
}

module.exports.updatingUser = async (req, res) => {
    res.setHeader("Content-type", "application/json")
    if(db()){
        try{
            const userId = req.params.id
            const updating = await userModel.findByIdAndUpdate(userId, {ativo: true})
            if(updating){
                res.status(200).send({sucesso: "atualizado com sucesso"})
            }else{
                res.status(400).send({error: "erro ao atualizar"})
            }
        }catch(err){
            res.status(400).json({error: err})
        }
    }else{
        res.status(404).json({error: "Database não encontrada"})
    }
}

module.exports.deleteUser = (req, res) => {
    res.setHeader("Content-type", "application/json")
    if(db()){
        try{
            const userId = req.params.id
            userModel.findByIdAndDelete(userId, (err, docs)=>{
                if(err){
                    res.status(400).send({error: err})
                    return
                }

                res.status(200).send({success: "Removido com sucesso"})
            })
            
        }catch(err){
            res.status(400).json({error: err})
        }
    }else{
        res.status(404).json({error: "Database não encontrada"})
    }
}

