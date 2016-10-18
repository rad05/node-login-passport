'use strict';

var passport = require('passport');  
var mongoose = require('mongoose');  
var Account = mongoose.model('accounts');

module.exports.init = function(app) {  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, done);
  });

  // load strategies

};
