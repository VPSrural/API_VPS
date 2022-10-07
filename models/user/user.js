const mongoose = require('mongoose')
mongoose.set('debug', true)

const user = mongoose.Schema({
    idAlphaExpress: {type: Number, required: true},
    idCompany: mongoose.ObjectId,
    login: {type: String, required: true},
    password: {type: String, required: true},
    ativo: {type: Boolean, default: true},
    token: {type: String},
},
{
    toJSON: {
        getters: true
    }
})

// name of collection and my schema
const UserModel = mongoose.model('User', user)

module.exports = UserModel