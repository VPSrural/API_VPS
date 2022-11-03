const express = require('express');
const router = express.Router();

// importing controllers
const controllerCP = require('../controllers/financeiro/contas_pagar')
const controllerCR = require('../controllers/financeiro/contas_receber')
const controllerFI = require('../controllers/financeiro/financiamento')
const controllerCC = require('../controllers/financeiro/conta_corrente')

/* GET rotasPagar. */
/* CONTAS A PAGAR */
//ok
router.get('/financeiro/contasPagar', controllerCP.gettingAllDataContasPagar)
router.get('/financeiro/contasPagarTwenty', controllerCP.gettingContasPagarByData)
router.get('/financeiro/contasPagarFiltered', controllerCP.filteringContasPagar)
router.post('/financeiro/contasPagar', controllerCP.insertingDataContasPagar)
router.delete('/financeiro/contasPagar', controllerCP.deletingDataContasPagar)

/* CONTAS A RECEBER */
//ok
router.get('/financeiro/contaReceber', controllerCR.gettingAllDataContaReceber)
router.get('/financeiro/contasReceberTwenty', controllerCR.gettingContasReceberByTwenty)
router.get('/financeiro/contasReceberFiltered', controllerCR.filteringContasReceber)
router.post('/financeiro/contaReceber', controllerCR.insertingDataContasReceber)
router.delete('/financeiro/contaReceber', controllerCR.deletingContaReceber)

/* FINANCIAMENTO */
router.get('/financeiro/financiamento', controllerFI.gettingAllDataFinanciamento)
router.get('/financeiro/financiamentoFiltered', controllerFI.filteringFinanciamento)
router.post('/financeiro/financiamento', controllerFI.insertingDataFinanciamento)
router.delete('/financeiro/financiamento', controllerFI.deletingDataFinanciamento)

/* CONTA CORRENTE */
//ok
router.get('/financeiro/contaCorrente', controllerCC.gettingAllDataContaCorrente)
router.get('/financeiro/contaCorrenteFiltered', controllerCC.filteringContaCorrente)
router.post('/financeiro/contaCorrente', controllerCC.insertingDataContaCorrente)
router.delete('/financeiro/contaCorrente', controllerCC.deletingDataContaCorrente)

module.exports = router;
