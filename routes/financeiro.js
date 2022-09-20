const express = require('express');
const router = express.Router();
const controllerFin = require('../controllers/controllFinanceiro')

/* GET rotasPagar. */
/* CONTAS A PAGAR */
router.get('/financeiro/contasPagar', controllerFin.gettingAllDataContasPagar)
router.get('/financeiro/contasPagarTwenty', controllerFin.gettingContasPagarByData)
router.get('/financeiro/contasPagarFiltered', controllerFin.filteringContasPagar)

/* FINANCIAMENTO */
router.get('/financeiro/financiamento', controllerFin.gettingAllDataFinanciamento)

/* CONTA CORRENTE */
router.get('/financeiro/contaCorrente', controllerFin.gettingAllDataContaCorrente)

/* CONTAS A RECEBER */
router.get('/financeiro/contaReceber', controllerFin.gettingAllDataContaReceber)

module.exports = router;
