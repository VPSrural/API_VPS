const mongoose = require('mongoose')
mongoose.set('debug', true)

const admin = mongoose.Schema({
    login: {type: String, required: true},
    senha: {type: String, required: true},
    cpf: {type: String, required: true},
    nome: {type: String, required: true},
    rg: {type: String, required: true},
    ativo: {type: Boolean, default: true},
    token: {type: String}
},
{
 toJSON: {
    getters: true
 }   
})

const adminModel = mongoose.model('Admin', admin)

module.exports = adminModel;