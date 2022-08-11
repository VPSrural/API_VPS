const mongoose = require("mongoose");
const contasPagarModel = require("./financeiro/contas_pagar");

module.exports = () => {
  // conectando com o mongodb
  try{
    const queryMongo = process.env.CONNECTIONMONGO;
    mongoose.Promise = global.Promise;
    mongoose.connect(queryMongo)
    return true;
  }catch(err){
    console.log(err)
    return false
  }


  
};
