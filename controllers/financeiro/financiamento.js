const express = require('express')
const financiamentoModel = require('../../models/financeiro/financiamento')
const db = require('../../models/connetion')

// financiamento
module.exports.gettingAllDataFinanciamento = async (req, res, next) => {
    res.setHeader("content-type", "application/json")
    if(db()){

        try{
            
            const result = await financiamentoModel
            .aggregate()
            .group({_id: "$NOME"})
            
            res.status(200).send(result)

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

            
            if(DT_VEN && DT_VEN_F && NOME){ //!ok

                const result = await financiamentoModel.find({$and: [
                    {NOME: {$eq: NOME}}, //equals
                    {DT_VEN: {$gte: new Date(DT_VEN)}}, // greater than and equals
                    {DT_VEN: {$lte: new Date(DT_VEN_F)}} // less than and equals
                ]})
                .sort({DT_VEN: 1})
                .exec()

                res.status(200).send(result)
            }
            if(DT_VEN && DT_VEN_F && !NOME){ //!ok

                const result = await financiamentoModel.find({$and: [
                    {DT_VEN: {$gte: DT_VEN}},
                    {DT_VEN: {$lte: DT_VEN_F}}
                ]})
                .sort({DT_VEN: 1})

                res.status(200).send(result)
            }
            if(DT_VEN_F && !DT_VEN && !NOME){ //!ok
                const currentDate = new Date()

                const result = await financiamentoModel.find({$and: [
                    {DT_VEN: {$gte: currentDate}},
                    {DT_VEN: {$lte: DT_VEN_F}},
                ]})
                .sort({DT_VEN: 1})
                .exec()

                res.status(200).send(result)
            }
            if(NOME && !DT_VEN && !DT_VEN_F){ //!ok

                const result = await financiamentoModel.find({$and: [
                    {NOME: {$eq: NOME}},
                ]})
                .sort({DT_VEN: 1})
                .exec()

                res.status(200).send(result)

            }
            if(!DT_VEN && !DT_VEN_F && !NOME){ //!ok
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

module.exports.insertingDataFinanciamento = async (req, res, next) => {
    res.setHeader("Content-Type", "application/json")
    if(db()){
        const dataToInsert = req.body;
        dataToInsert.map((item, index)=>{
            if(item._id){
                if(updatingDataFinanciamento(item)){
                    console.log("atualizado com sucesso!!")
                }else{
                    console.log("houve erro na alteração!!")
                }
            }else{
                financiamentoModel.insertMany(item, (err, docs) => {
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

const updatingDataFinanciamento = async (objectToUpdate) => {
    financiamentoModel.findByIdAndUpdate(objectToUpdate._id, {
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

module.exports.deletingDataFinanciamento = (req, res, next) => {
    res.setHeader("Content-type", "application/json")
    const IDsToDelete = req.body
    if(db()){
        IDsToDelete.map((item, index)=>{
            financiamentoModel.findByIdAndDelete(item._id, (err, docs)=> {
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