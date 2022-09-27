const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config()
const bodyParser = require('body-parser')
const periodicFunc = require('./periodicFunctionSQL')

const app = express();

//rotas
// var indexRouter = require('./routes/index');
const defaultt = require('./routes/default')
const financeiro = require('./routes/financeiro');

// midllewares
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*
 * Funcao para buscar os dados do sql server
 */
// setInterval(async function (){

//   await 
  
// }, 3000000); // executa a cada uma hora

// periodicFunc.conexaoDB()


// default
app.use('/api/v1', defaultt);


//encaminhando para rotas
app.use('/api/v1', financeiro);


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
  res.send('error');
});


module.exports = app;
