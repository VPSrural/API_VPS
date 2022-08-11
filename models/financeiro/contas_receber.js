const mongoose = require('mongoose')
mongoose.set('debug', true)

const contaReceber = mongoose.Schema({
    Valor: Number,
    Data_de_vencimento: String,
    Atividade: String,
    Cliente: String,
    Situacao: String,
    Valor_pago: Number
},
{
    toJSON: {
        getters: true
    }
})

const contaReceberModel = mongoose.model('Contarecebe', contaReceber)

module.exports = contaReceberModel