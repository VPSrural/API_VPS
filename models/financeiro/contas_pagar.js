const mongoose = require('mongoose')
mongoose.set('debug', true)

//estrura de dados do schema
const contas_pagar = mongoose.Schema({
    Valor: Number,
    Data_de_vencimento: String,
    Atividade: String,
    Nome: String,
    Financiamento: String,
    Situacao_pagar: String,
},
{
    toJSON: {
        getters: true
    }
})

// name, schema, collection
/*The first argument is the singular name of the collection your model is for. Mongoose 
automatically looks for the plural, lowercased version of your model name */
const ContaspagarModel = mongoose.model('Financeiro', contas_pagar)

module.exports = ContaspagarModel