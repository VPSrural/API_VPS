const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllFinanceiro')

/* GET rotasPagar. */
router.get('/financeiro/contasPagar', controller.gettingAllData);

module.exports = router;
