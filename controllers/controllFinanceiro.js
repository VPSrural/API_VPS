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

//constas a pagar ordenada por data
module.exports.gettingContasPagarByData = async (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    if(db()){
        try{
            const dateNow = new Date();
            
            const result = await contasPagarModel.find({$and: 
                [
                    {Data_de_vencimento: {$gte: dateNow}},

                ]}).sort({Data_de_vencimento: 1})
                .where("Situacao_Pagar == Aberto")
                .limit(10).exec();

            res.status(200).send(result)
        }catch(err){
            res.send(err)
            res.status(404).send("Database nao encontrada")
        }
    }
}

// filtering data with URL params to filter in Application
module.exports.filteringContasPagar = async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    if(db()){
        try{
            const atividade = req.query.atv;
            const initialDate = req.query.iniDate;
            const finalDate = req.query.finalDate;
            const fornecedor = req.query.cliente;
            console.log(atividade, initialDate, finalDate, fornecedor)
            if(atividade && initialDate && finalDate && fornecedor){

                
                const resultAll = await contasPagarModel
                .find({$and: [
                    {Atividade: {$eq: atividade}},
                    {cliente: {$eq: fornecedor}},
                    {Data_de_vencimento: {$gte: initialDate}},
                    {Data_de_vencimento: {$lte: new Date(`${finalDate}`)}}
                ]})
                .where({Situacao_Pagar: "Aberto"})
                .sort({Data_de_vencimento: -1})
                .exec();
                res.status(200).send(resultAll)


            }
            if(atividade && initialDate && finalDate && !fornecedor){

                const resultAtvIniFinal = await contasPagarModel
                .find({$and: [
                    {Atividade: {$eq: atividade}},
                    {Data_de_vencimento: {$gte: initialDate}},
                    {Data_de_vencimento: {$lte: new Date(`${finalDate}`)}}
                ]})
                .where({Situacao_Pagar: "Aberto"})
                .sort({Data_de_vencimento: -1})
                .exec();
                res.status(200).send(resultAtvIniFinal)

            }
            if(finalDate && initialDate && !atividade && !fornecedor){
                
                const resultBetweenDates = await contasPagarModel
                .find({$and: [
                    {Data_de_vencimento: {$gte: new Date(initialDate)}},
                    {Data_de_vencimento: {$lte: new Date(`${finalDate}`)}}
                ]})
                .where({Situacao_Pagar: "Aberto"})
                .sort({Data_de_vencimento: -1})
                .exec();
                res.status(200).send(resultBetweenDates)

            }
            if(atividade && !initialDate && !finalDate && !fornecedor){

                const resultAtv = await contasPagarModel
                .find({Atividade: {$eq: atividade}})
                .where({Situacao_Pagar: "Aberto"})
                .exec();
                res.status(200).send(resultAtv)

            }
            if(finalDate &&!atividade && !initialDate && !fornecedor){

                const currentDate = new Date(); 
                
                const resultFinalDate = await contasPagarModel
                .find({$and: [
                    {Data_de_vencimento: {$gte: currentDate}},
                    {Data_de_vencimento: {$lte: new Date(`${finalDate}`)}}
                ]})
                .where({Situacao_Pagar: "Aberto"})
                .sort({Data_de_vencimento: -1})
                .exec();
                res.status(200).send(resultFinalDate)


            }
            if(fornecedor && !finalDate && !atividade && !initialDate){
                                
                const resultFinalDate = await contasPagarModel
                .find({$and: [
                    {cliente: {$eq: fornecedor}},
                ]})
                .where({Situacao_Pagar: "Aberto"})
                .sort({Data_de_vencimento: -1})
                .exec();
                res.status(200).send(resultFinalDate)

            }

            
            
        }catch(err){
            res.send(err);
            res.status(404).send("Database nao encontrada");
        }
    }
}

// contas a receber queries
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

// filtering contas a receber
module.exports.filteringContasReceber = async (req, res) => {

    res.setHeader("content-type", "application/json")
    if(db()){
        try{

            const atividade = req.query.atv;
            const initialDate = req.query.iniDate;
            const finalDate = req.query.finalDate;
            const cliente = req.query.cliente;

            if(atividade && initialDate && finalDate && cliente){//!OK

                const resultAll = await contaReceberModel
                .find({$and: [
                    {Atividade: {$eq: atividade}},
                    {Cliente: {$eq: cliente}},
                    {Data_de_vencimento: {$gte: new Date(initialDate)}},
                    {Data_de_vencimento: {$lte: new Date(finalDate)}}
                ]})
                .where({Situacao: "Em aberto"})
                .sort({Data_de_vencimento: -1})
                .exec()

                res.status(200).send(resultAll)

            }
            if(atividade && initialDate && finalDate && !cliente){//!OK

                const resultAtvIniFinal = await contaReceberModel
                .find({$and: [
                    {Atividade: {$eq: atividade}},
                    {Data_de_vencimento: {$gte: new Date(initialDate)}},
                    {Data_de_vencimento: {$lte: new Date(`${finalDate}`)}}
                ]})
                .where({Situacao: "Em aberto"})
                .sort({Data_de_vencimento: -1})
                .exec();
                res.status(200).send(resultAtvIniFinal)

            }
            if(finalDate && initialDate && !atividade && !cliente){//!OK
                
                const resultBetweenDates = await contaReceberModel
                .find({$and: [
                    {Data_de_vencimento: {$gte: new Date(initialDate)}},
                    {Data_de_vencimento: {$lte: new Date(`${finalDate}`)}}
                ]})
                .where({Situacao: "Em aberto"})
                .sort({Data_de_vencimento: -1})
                .exec();
                res.status(200).send(resultBetweenDates)

            }
            if(atividade && !initialDate && !finalDate && !cliente){//!OK

                const resultAtv = await contaReceberModel
                .find({Atividade: {$eq: atividade}})
                .where({Situacao: "Em aberto"})
                .exec();
                res.status(200).send(resultAtv)

            }
            if(finalDate &&!atividade && !initialDate && !cliente){//!ok

                const currentDate = new Date(); 
                
                const resultFinalDate = await contaReceberModel
                .find({$and: [
                    {Data_de_vencimento: {$gte: currentDate}},
                    {Data_de_vencimento: {$lte: new Date(`${finalDate}`)}}
                ]})
                .where({Situacao: "Em aberto"})
                .sort({Data_de_vencimento: -1})
                .exec();
                res.status(200).send(resultFinalDate)


            }
            if(cliente && !finalDate && !atividade && !initialDate){//!OK
                                
                const resultFinalDate = await contaReceberModel
                .find({$and: [
                    {Cliente: {$eq: cliente}},
                ]})
                .where({Situacao: "Em aberto"})
                .sort({Data_de_vencimento: -1})
                .exec();
                res.status(200).send(resultFinalDate)

            }


        }catch(err){

            res.send(err)
            res.status(400).json({error: err})

        }
        

    }else{
        res.status(404).send("Database nao encontrada")
    }
}

// financiamento
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

// filtro financiamento
module.exports.filteringFinanciamento = async (req, res, next) => {
    res.setHeader("content-type", "application/json")

    if(db()){
        
        try{
            const DT_VEN = req.query.dtven;
            const DT_VEN_F = req.query.dtvenf;
            const NOME = req.query.nome;

            
            if(DT_VEN && DT_VEN_F && NOME){
                const result = await financiamentoModel.find({$and: [
                    {NOME: {$eq: NOME}}, //equals
                    {DT_VEN: {$gte: new Date(DT_VEN)}}, // greater than and equals
                    {DT_VEN: {$lte: new Date(DT_VEN_F)}} // less than and equals
                ]})
                .sort({DT_VEN: 1})
                .exec()

                res.status(200).send(result)
            }
            if(DT_VEN && DT_VEN_F && !NOME){
                const result = await financiamentoModel.find({$and: [
                    {DT_VEN: {$gte: DT_VEN}},
                    {DT_VEN: {$lte: DT_VEN_F}}
                ]})
                .sort({DT_VEN: 1})

                res.status(200).send(result)
            }
            if(DT_VEN_F && !DT_VEN && !NOME){
                const currentDate = new Date()

                const result = await financiamentoModel.find({$and: [
                    {DT_VEN: {$gte: currentDate}},
                    {DT_VEN: {$lte: DT_VEN_F}},
                ]})
                .sort({DT_VEN: 1})
                .exec()

                res.status(200).send(result)
            }
            if(!DT_VEN && !DT_VEN_F && !NOME){
                res.status(200).json({"warning": "Nenhum filtro encontrado"})
            }


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