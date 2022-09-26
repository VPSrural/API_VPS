const mongoose = require('mongoose')
mongoose.set('debug', true)

const contaCorrente = mongoose.Schema({
      NSITUACAO: Number,
      SITUACAO: String,
      NDEBCRE: Number,
      DEB_CRE: String,
      ID_LANCBC: Number,
      DT_LAN: Date,
      NVALOR: Number,
      NCHEQUE: String,
      NCONTA: String,
      NHISTORICO: String,
      NNUMERO: String,
      OBS: String,
      NTRANSFERE: Number,
      ID_RECEBE: Number,
      COMPRA: Number,
      LOTEPAGAMENTO: Number,
      ID_LAN_FUN: Number,
      VLR_CRE: Number,
      VLR_DEB: Number,
      ID_OPR_RECEBIMENTO: Number,
},
{
      toJSON: {
          getters: true
      }
})

const contaCorrenteModel = mongoose.model('Contacorrente', contaCorrente)

module.exports = contaCorrenteModel