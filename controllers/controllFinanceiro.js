const express = require('express')
const contasPagarModel = require('../models/financeiro/contas_pagar')
const db = require('../models/connetion')

// chamando todos os dados
// é necessário abrir conexao antes
module.exports.gettingAllData = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    if(db()){
        try{
            contasPagarModel.find({}, (err, data)=>{
                res.status(200);
                res.send(data);
            })
          }catch(err){
            res.send(err);
            res.status(400).json({error: err});
          }
    }else{
        res.status(400).send("Database nao encontrada")
    }
    

}