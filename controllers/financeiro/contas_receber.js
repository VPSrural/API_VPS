const express = require('express')
const contaReceberModel = require('../../models/financeiro/contas_receber')
const db = require('../../models/connetion')

// contas a receber queries
module.exports.gettingAllDataContaReceber = async (req, res, next) => {
    res.setHeader("content-type", "application/json")
    if(db()){

        try{

            const result = await contaReceberModel
            .aggregate()
            .group({_id: "$Atividade"})
            
            res.status(200).send(result)
        }catch(err){

            res.send(err)
            res.status(400).json({error: err})

        }

    }else{
        res.status(404).send("Database nao encontrada")
    }
}

// conta receber 10 proximas
module.exports.gettingContasReceberByTwenty = async (req, res, next) => {
    res.setHeader("content-type", "application/json")
    
    if(db()){
        const currentDate = new Date();
        try{
            const result = await contaReceberModel
            .find({Data_de_vencimento: {$gte: currentDate}})
            .sort({Data_de_vencimento: -1})
            .where({Situacao: "Em aberto"})
            .limit(10)
            .exec()
            
            res.status(200).send(result)
        }catch(err){
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

module.exports.insertingDataContasReceber = (req, res, next) => {
    res.setHeader("Content-Type", "application/json")
    if(db()){
        const dataToInsert = req.body;
        dataToInsert.map((item, index)=>{
            if(item._id){
                if(updatingDataContasReceber(item)){
                    console.log("atualizado com sucesso!!")
                }else{
                    console.log("houve erro na alteração!!")
                }
            }else{
                contaReceberModel.insertMany(item, (err, docs) => {
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

const updatingDataContasReceber = async (objecToUpdate) => {
    contaReceberModel.findByIdAndUpdate(objecToUpdate._id, {
        Valor: objecToUpdate.Valor,
        Data_de_vencimento: objecToUpdate.Data_de_vencimento,
        Atividade: objecToUpdate.Atividade,
        Cliente: objecToUpdate.Cliente,
        Situacao: objecToUpdate.Situacao,
        Valor_pago: objecToUpdate.Valor_pago
    }, (err, docs) => {
        if(!err) return true
        if(err) return false
    })
}

module.exports.deletingContaReceber = (req, res, next) => {
    res.setHeader("Content-Type", "application/json")
    const IDsToDelete = req.body

    if(db()){
        IDsToDelete.map((item, index)=>{
            contaReceberModel.findByIdAndDelete(item._id, (err, docs)=> {
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