const express = require('express')
const contasPagarModel = require('../models/financeiro/contas_pagar')
const financiamentoModel = require('../models/financeiro/financiamento')
const contaCorrenteModel = require('../models/financeiro/conta_corrente')
const contaReceberModel = require('../models/financeiro/contas_receber')
const db = require('../models/connetion')


// chamando todos os dados
// é necessário abrir conexao antes
module.exports.gettingAllDataContasPagar = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    if(db()){
        try{
            contasPagarModel.find({}, (err, data)=>{
                res.status(200).send(data)
            })
          }catch(err){
            res.send(err);
            res.status(400).json({error: err});
          }
    }else{
        res.status(404).send("Database nao encontrada")
    }
    
}

module.exports.gettingAllDataFinanciamento = (req, res, next) => {
    res.setHeader("content-type", "application/json")
    if(db()){

        try{
            financiamentoModel.find({}, (err, data)=>{
                res.status(200).send(data)
            })
        }catch(err){
            res.send(err)
            res.status(400).json({error: err})
        }
        
    }else{
        res.status(404).send("Database nao encontrada")
    }
}

module.exports.gettingAllDataContaCorrente = (req, res, next) => {
    res.setHeader("content-type", "application/json")
    if(db()){
        try{
            contaCorrenteModel.find({}, (err, data)=>{
                res.status(200).send(data)
            })
        }catch(err){
            res.send(err)
            res.status(400).json({error: err})
        }
    }else{
        res.status(404).send("Database nao encontrada")
    }
}

module.exports.gettingAllDataContaReceber = (req, res, next) => {
    res.setHeader("content-type", "application/json")
    if(db()){

        try{

            contaReceberModel.find({}, (err, data) => {
                res.status(200).send(data)
            })
            
        }catch(err){

            res.send(err)
            res.status(400).json({error: err})

        }

    }else{
        res.status(404).send("Database nao encontrada")

    }
}