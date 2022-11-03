const express = require('express')
const contasPagarModel = require('../models/financeiro/contas_pagar')
const financiamentoModel = require('../models/financeiro/financiamento')
const contaCorrenteModel = require('../models/financeiro/conta_corrente')
const contaReceberModel = require('../models/financeiro/contas_receber')
const db = require('../models/connetion')


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

module.exports.insertingDataContasPagar = async (req, res, next) => {
    res.setHeader("Content-Type", "application/json")
    if(db()){
        const dataToInsert = req.body;
        if(dataToInsert._id){
            res.status(200).json({message: "atualizando aqui"})
        }else{
            contasPagarModel.insertMany(dataToInsert, (err, docs) => {
                if(!err){
                    res.status(200).json({message: "Inserido com sucesso!!"})
                }else{
                    res.status(400).json({message: "Dados nao foram inseridos!!"})
                }
            })
        }
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