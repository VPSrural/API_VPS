const mongoose = require('mongoose')
mongoose.set('debug', true)

const financiamento = mongoose.Schema({
    DT_LAN: String,
    NOME: String,
    TIPO_DOC: String,
    ValorPago: Number,
    ValorAberto: Number,
    ValorTotal: Number,
    QtPago: Number,
    QtPagar: Number,
    QtParcelas: Number,
},
{
    toJSON: {
        getters: true
    }
})

const FinanciamentoModel = mongoose.model('Financiamento', financiamento)

module.exports = FinanciamentoModel