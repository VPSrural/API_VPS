var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sql = require("mssql")
require('dotenv').config()


var app = express();

//rotas
// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// midllewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
 * Funcao para buscar os dados do sql server
 */
const conexaoDB = async () => {
  
  try {

    await sql.connect("Data Source=NERI\\SQL2019;Database=LUCIANE;Encrypt=False;Integrated Security=False;User ID=sa;Password=112658")
    
    console.log("connected")

    // consultando as views e pegando seus dados
    const QUERY_BALANCO_PATRIMONIAL_ATIVOS = await sql.query("select * from QUERY_BALANCO_PATRIMONIAL_ATIVOS")
    const QUERY_BALANCO_PATRIMONIAL_EVOLUCAO = await sql.query("select * from QUERY_BALANCO_PATRIMONIAL_EVOLUCAO")
    const QUERY_BALANCO_PATRIMONIAL_EVOLUCAO_INDIVIDAMENTO = await sql.query("select * from QUERY_BALANCO_PATRIMONIAL_EVOLUCAO_INDIVIDAMENTO")
    const QUERY_BALANCO_PATRIMONIAL_INDICADORES_INDIVIDAMENTO = await sql.query("select * from QUERY_BALANCO_PATRIMONIAL_INDICADORES_INDIVIDAMENTO")
    const QUERY_BALANCO_PATRIMONIAL_INIDICADORES_EVOLUCAO = await sql.query("select * from QUERY_BALANCO_PATRIMONIAL_INIDICADORES_EVOLUCAO")
    const QUERY_BALANCO_PATRIMONIAL_PASSIVOS = await sql.query("select * from QUERY_BALANCO_PATRIMONIAL_PASSIVOS")
    const QUERY_CONTA_CORRENTE = await sql.query("select * from QUERY_CONTA_CORRENTE")
    const QUERY_CONTAS_PAGAR = await sql.query("select * from QUERY_CONTAS_PAGAR")
    const QUERY_CONTAS_RECEBER =  await sql.query("select * from QUERY_CONTAS_RECEBER")
    const QUERY_CUSTO_DE_PRODUCAO = await sql.query("select * from QUERY_CUSTO_DE_PRODUCAO")
    const QUERY_CUSTO_DE_PRODUCAO_DIRETO_INDIRETO_TOTAL = await sql.query("select * from QUERY_CUSTO_DE_PRODUCAO_DIRETO_INDIRETO_TOTAL")
    const QUERY_CUSTO_DIRETO = await sql.query("select * from QUERY_CUSTO_DIRETO")
    const QUERY_CUSTO_DIRETO_PRODUCAO = await sql.query("select * from QUERY_CUSTO_DIRETO_PRODUCAO")
    const QUERY_CUSTO_DIRETO_PRODUCAO_CORRIGIDA = await sql.query("select * from QUERY_CUSTO_DIRETO_PRODUCAO_CORRIGIDA")
    const QUERY_DETALHES_DE_PRODUCAO = await sql.query("select * from QUERY_DETALHES_DE_PRODUCAO")
    const QUERY_ESTOQUE = await sql.query("select * from QUERY_ESTOQUE")
    const QUERY_ESTOQUE_ENTRADAS = await sql.query("select * from QUERY_ESTOQUE_ENTRADAS")
    const QUERY_ESTOQUE_ENTREGAS = await sql.query("select * from QUERY_ESTOQUE_ENTREGAS")
    const QUERY_ESTOQUE_PECUARIA = await sql.query("select * from QUERY_ESTOQUE_PECUARIA")
    const QUERY_ESTOQUE_SAIDAS = await sql.query("select * from QUERY_ESTOQUE_SAIDAS")
    const QUERY_FINANCIAMENTOS = await sql.query("select * from QUERY_FINANCIAMENTOS")
    const QUERY_PARCELAS_FINANCIAMENTO = await sql.query("select * from QUERY_PARCELAS_FINANCIAMENTO")
    const QUERY_PATRIMONIO = await sql.query("select * from QUERY_PATRIMONIO")
    const QUERY_PATRIMONIO_LISTAGEM = await sql.query("select * from QUERY_PATRIMONIO_LISTAGEM")
    const QUERY_PER_AREA = await sql.query("select * from QUERY_PER_AREA")
    const QUERY_RESULTADOS = await sql.query("select * from QUERY_RESULTADOS")
    const QUERY_TABELA_DE_CUSTO = await sql.query("select * from QUERY_TABELA_DE_CUSTO")

    console.log("Consultas terminadas")
    
    

  }catch(err){

    console.log(err)

  }


}


// app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

conexaoDB()

module.exports = app;
