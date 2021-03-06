'use strict';
const Express = require('express');
const app = new Express();
const mongoose = require('mongoose');
const config = require('./config');
const handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
const MongoConnectionOptions = {
  server: {
    socketOptions: { keepAlive: 120 }
  }
};

// Setup handlebars as the view & template engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

// Middleware
app.use(Express.static('public'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('cookie-parser')(config.cookieSecret));
app.use(require('express-session')({
  resave: false,
  saveUninitialized: false,
  secret: config.cookieSecret
}));
app.use(function(req, res, next){
 res.locals.flash = req.session.flash;
 delete req.session.flash;
 next();
});

// Setup MongoDB database connection
if (app.get('env') === 'development') {
  mongoose.connect(config.mongo.development.connectionString, MongoConnectionOptions);
} else {
  throw new Error('Unknown execution enviroment: ' + app.get('env'));
}

module.exports = app;
