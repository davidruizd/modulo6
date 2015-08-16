var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('awpiksfo'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next) {

  //guardar path en session.redir para usar despues del login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }
  //hacer visible req.session
  res.locals.session = req.session;
  next();

});

//expirar sesion a los 2 minutos.
app.use( function(req,res, next) {
  //si no hay sesion de usuario no tiene sentido destruir algo que no existe
  if (req.session.user) {
    if (!req.session.tiempo) {
      //Obtiene la hora actual en ms
      req.session.tiempo = (new Date()).getTime();
    } else {
      //Comprobacion de si han pasado 2 o más minutos (2(min)*60(min->sec)*1000(sec->ms))
      if ((new Date().getTime() >= req.session.tiempo+120000)) {
        delete req.session.user;
        //si no borramos la variable tiempo nunca más podremos logearnos de nuevo
        //ya que se logea y auto-deslogea
        delete req.session.tiempo;
      } else {
        //si no ha pasado el tiempo se actualiza la hora.
        req.session.tiempo = (new Date()).getTime();
      }
    }
  }
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
