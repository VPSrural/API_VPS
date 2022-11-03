const express = require('express')
const contasPagarModel = require('../../models/financeiro/contas_pagar')
const db = require('../../models/connetion')

// chamando todos os dados
// é necessário abrir conexao antes
module.exports.gettingAllDataContasPagar = async (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    if(db()){
        try{
            const result = await contasPagarModel
            .aggregate()
            .group({_id: "$Atividade"})
            
            res.status(200).send(result)
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

                ]})
                .sort({Data_de_vencimento: 1})
                .where("Situacao_Pagar == Aberto")
                .limit(10)
                .exec();

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
            console.log(fornecedor)
            if(atividade && initialDate && finalDate && fornecedor){//!ok

                
                const resultAll = await contasPagarModel
                .find({$and: [
                    {Atividade: {$eq: atividade}},
                    {NOME: {$eq: fornecedor}},
                    {Data_de_vencimento: {$gte: initialDate}},
                    {Data_de_vencimento: {$lte: new Date(`${finalDate}`)}}
                ]})
                .where({Situacao_Pagar: "Aberto"})
                .sort({Data_de_vencimento: -1})
                .exec();
                res.status(200).send(resultAll)


            }
            if(atividade && initialDate && finalDate && !fornecedor){//!ok

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
            if(finalDate && initialDate && !atividade && !fornecedor){//!ok
                
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
            if(atividade && !initialDate && !finalDate && !fornecedor){//!ok

                const resultAtv = await contasPagarModel
                .find({Atividade: {$eq: atividade}})
                .where({Situacao_Pagar: "Aberto"})
                .exec();
                res.status(200).send(resultAtv)

            }
            if(finalDate &&!atividade && !initialDate && !fornecedor){//!ok

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
            if(fornecedor && !finalDate && !atividade && !initialDate){//!ok
                                
                const resultFinalDate = await contasPagarModel
                .find({$and: [
                    {NOME: {$eq: fornecedor}},
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

// para atualizar precisa apenas passar o _id
// caso nao passe ele ja insere direto
module.exports.insertingDataContasPagar = async (req, res, next) => {
    res.setHeader("Content-Type", "application/json")
    if(db()){
        const dataToInsert = req.body;
        dataToInsert.map((item, index)=>{
            if(item._id){
                if(updatingDataContasPagar(item)){
                    console.log("atualizado com sucesso!!")
                }else{
                    console.log("houve erro na alteração!!")
                }
            }else{
                contasPagarModel.insertMany(item, (err, docs) => {
                    if(!err){
                        console.log("Inserido com sucesso!!")
                    }else{
                        console.log("Dados não foram inseridos!!")
                    }
                })
            }
        })
        
        res.status(200).json({message: "sincronização feita!!"})
    }
}

const updatingDataContasPagar = async (objectToUpdate) => {
    contasPagarModel.findByIdAndUpdate(objectToUpdate._id, {
        Valor: objectToUpdate.Valor,
        Data_de_vencimento: objectToUpdate.Data_de_vencimento,
        Atividade: objectToUpdate.Atividade,
        NOME: objectToUpdate.NOME,
        Financiamento: objectToUpdate.Financiamento,
        Situacao_Pagar: objectToUpdate.Situacao_Pagar,
    }, (err, docs) => {
        if(!err) return true
        if(err) return false
    })
}

module.exports.deletingDataContasPagar = (req, res, next) => {
    res.setHeader("Content-type", "application/json")
    const IDsToDelete = req.body
    if(db()){
        IDsToDelete.map((item, index)=>{
            contasPagarModel.findByIdAndDelete(item._id, (err, docs)=> {
                if(!err){
                    console.log("deletado com sucesso !!")
                }else{
                    res.status(400).json({message: "Não foram deletados"})
                    return
                }
            })
        })
        res.status(200).json({message: "Deletados com sucesso!!"})
    }
}