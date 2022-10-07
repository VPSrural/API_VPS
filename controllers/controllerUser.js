const express = require('express')
const db = require('../models/connetion') // connection environment
const userModel = require('../models/user/user')
const md5 = require('md5')

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

module.exports.creatingUser = (req, res) => {
    res.setHeader("Content-type", "application/json")
    if(db()){

        try{
            const idAlpha = req.body.idAlphaExpress
            const login = req.body.login
            const password = md5(req.body.password)


            console.log(idAlpha, login, password)
            
            res.send({"teste":"eaea"})
        }catch(err){

            res.status(400).json({error: err})
        }

    }else{
        res.status(404).json({error: "Database não encontrada"})
    }
}