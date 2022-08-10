const mongoose = require("mongoose");
const contasPagarModel = require("./financeiro/contas_pagar");

module.exports = () => {
  // conectando com o mongodb
  try{
    const queryMongo =
    "mongodb+srv://alphasoftware:alpha2020@vpsdashboards.nnbvkyc.mongodb.net/vpsdash_board?retryWrites=true&w=majority";
    mongoose.Promise = global.Promise;
    mongoose.connect(queryMongo)
    return true;
  }catch(err){
    console.log(err)
    return false
  }


  
};
