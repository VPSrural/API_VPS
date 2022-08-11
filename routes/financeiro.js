const express = require('express');
const router = express.Router();
const controllerFin = require('../controllers/controllFinanceiro')

/* GET rotasPagar. */
router.get('/financeiro/contasPagar', controllerFin.gettingAllDataContasPagar);
router.get('/financeiro/financiamento', controllerFin.gettingAllDataFinanciamento)
router.get('/financeiro/contaCorrente', controllerFin.gettingAllDataContaCorrente)
router.get('/financeiro/contaReceber', controllerFin.gettingAllDataContaReceber)

module.exports = router;
