'use strict';

var passport = require('passport');  
var LocalStrategy = require('passport-local').Strategy;  
var mongoose = require('mongoose');
var Account = mongoose.model('accounts');

module.exports = function() {  
  passport.use('local', new LocalStrategy({
      usernameField: 'user',
      passwordField: 'pass'
    },
    function(username, password, done) {
      Account.authenticate(email, password, function(err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, { message: 'Invalid username or password.' });
        }

        return done(null, user);
      });
    }
  ));
};
