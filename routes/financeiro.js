const express = require('express');
const router = express.Router();
const controllerFin = require('../controllers/controllFinanceiro')

/* GET rotasPagar. */
/* CONTAS A PAGAR */
//ok
router.get('/financeiro/contasPagar', controllerFin.gettingAllDataContasPagar)
router.get('/financeiro/contasPagarTwenty', controllerFin.gettingContasPagarByData)
router.get('/financeiro/contasPagarFiltered', controllerFin.filteringContasPagar)
router.post('/financeiro/contasPagar', controllerFin.insertingDataContasPagar)


/* CONTAS A RECEBER */
//ok
router.get('/financeiro/contaReceber', controllerFin.gettingAllDataContaReceber)
router.get('/financeiro/contasReceberTwenty', controllerFin.gettingContasReceberByTwenty)
router.get('/financeiro/contasReceberFiltered', controllerFin.filteringContasReceber)

/* FINANCIAMENTO */
router.get('/financeiro/financiamento', controllerFin.gettingAllDataFinanciamento)
router.get('/financeiro/financiamentoFiltered', controllerFin.filteringFinanciamento)

/* CONTA CORRENTE */
//ok
router.get('/financeiro/contaCorrente', controllerFin.gettingAllDataContaCorrente)
router.get('/financeiro/contaCorrenteFiltered', controllerFin.filteringContaCorrente)

module.exports = router;
