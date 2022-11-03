const express = require('express')
const contaCorrenteModel = require('../../models/financeiro/conta_corrente')
const db = require('../../models/connetion')

module.exports.gettingAllDataContaCorrente = async (req, res, next) => {
    res.setHeader("content-type", "application/json")
    if(db()){
        try{

            // group by account
            const result = await contaCorrenteModel
            .aggregate()
            .group({_id: "$NCONTA"})

            res.status(200).send(result)
        }catch(err){
            res.send(err)
            res.status(400).json({error: err})
        }
    }else{
        res.status(404).send("Database nao encontrada")
    }
}

module.exports.filteringContaCorrente = async (req, res, next) => {
    res.setHeader("content-type", "application/json");
    if(db()){
        
        try{
            const iniDate = req.query.iniDate;
            const finDate = req.query.finDate;
            const conta = req.query.conta;
            const deb_cre = req.query.deb_cre;

            if(iniDate && finDate && conta){//!OK
                const result = await contaCorrenteModel
                .find({$and: [
                    {DT_LAN: {$gte: iniDate}},
                    {DT_LAN: {$lte: finDate}},
                    {NCONTA: {$eq: conta}},
                    {DEB_CRE: {$eq: deb_cre}}
                ]})
                .sort({DT_LAN: -1})
                .exec()

                res.status(200).send(result)
            }

            if(!iniDate && !finDate && conta){

                const result = await contaCorrenteModel
                .find({$and: [
                    {NCONTA: {$eq: conta}},
                    {DEB_CRE: {$eq: deb_cre}}
                ]})
                .sort({DT_LAN: -1})
                .exec()

                res.status(200).send(result)

            }

            if(iniDate && finDate && !conta){
                const result = await contaCorrenteModel
                .find({$and: [
                    {DT_LAN: {$gte: iniDate}},
                    {DT_LAN: {$lte: finDate}},
                    {DEB_CRE: {$eq: deb_cre}}
                ]})
                .sort({DT_LAN: -1})
                .exec()

                res.status(200).send(result)
            }
            console.log(iniDate, finDate, conta, deb_cre)

            // res.send({"teste": "guizaodozap"})

        }catch(err){
            res.send(err)
            res.status(200).json({error: err})
        }

    }else{
        res.status(404).send("Database nao encontrada")
    }
}

module.exports.insertingDataContaCorrente = async (req, res, next) => {
    res.setHeader("Content-Type", "application/json")
    if(db()){
        const dataToInsert = req.body;
        dataToInsert.map((item, index) => {
            if(item._id){
                if(updatingDataContaCorrente(item)){
                    console.log("atualizado com sucesso!!")
                }else{
                    console.log("houve erro na alteração!!")
                }
            }else{
                contaCorrenteModel.insertMany(item, (err, docs) => {
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

const updatingDataContaCorrente = (objectToUpdate) => {
    contaCorrenteModel.findByIdAndUpdate(objectToUpdate._id, {
        NSITUACAO: objectToUpdate.NSITUACAO,
        SITUACAO: objectToUpdate.SITUACAO,
        NDEBCRE: objectToUpdate.NDEBCRE,
        DEB_CRE: objectToUpdate.DEB_CRE,
        ID_LANCBC: objectToUpdate.ID_LANCBC,
        DT_LAN: objectToUpdate.DT_LAN,
        NVALOR: objectToUpdate.NVALOR,
        NCHEQUE: objectToUpdate.NCHEQUE,
        NCONTA: objectToUpdate.NCONTA,
        NHISTORICO: objectToUpdate.NHISTORICO,
        NNUMERO: objectToUpdate.NNUMERO,
        OBS: objectToUpdate.OBS,
        NTRANSFERE: objectToUpdate.NTRANSFERE,
        ID_RECEBE: objectToUpdate.ID_RECEBE,
        COMPRA: objectToUpdate.COMPRA,
        LOTEPAGAMENTO: objectToUpdate.LOTEPAGAMENTO,
        ID_LAN_FUN: objectToUpdate.ID_LAN_FUN,
        VLR_CRE: objectToUpdate.VLR_CRE,
        VLR_DEB: objectToUpdate.VLR_DEB,
        ID_OPR_RECEBIMENTO: objectToUpdate.ID_OPR_RECEBIMENTO,
    }, (err, docs) => {
        if(!err) return true
        if(err) return false
    })
}

module.exports.deletingDataContaCorrente = (req, res, next) => {
    res.setHeader("Content-type", "application/json")
    const IDsToDelete = req.body
    if(db()){
        IDsToDelete.map((item, index)=>{
            contaCorrenteModel.findByIdAndDelete(item._id, (err, docs)=> {
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