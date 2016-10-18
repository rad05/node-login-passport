
var crypto 		= require('crypto');
//var MongoDB 	= require('mongodb').Db;
//var Server 		= require('mongodb').Server;
var moment 		= require('moment');
var accountModel = require('../../../models/accounts');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var express = require('express');
 var app= express()

app.use(passport.initialize());
app.use(passport.session());

//var accounts = accountModel.accounts

/*
	ESTABLISH DATABASE CONNECTION
*/

/*var dbName = process.env.DB_NAME || 'node-login';
var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;*/

/*var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
db.open(function(e, d){
	if (e) {
		console.log(e);
	} else {
		if (process.env.NODE_ENV == 'live') {
			db.authenticate(process.env.DB_USER, process.env.DB_PASS, function(e, res) {
				if (e) {
					console.log('mongo :: error: not authenticated', e);
				}
				else {
					console.log('mongo :: authenticated and connected to database :: "'+dbName+'"');
				}
			});
		}	else{
			console.log('mongo :: connected to database :: "'+dbName+'"');
		}
	}
});*/

//var accounts = db.collection('accounts');
//var accounts= accountModel.accounts

/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
	accountModel.accounts.findOne({user:user}, function(e, o) {
	//accounts.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.manualLogin = function(user, pass, app,callback) {
	/*accountModel.accounts.findOne({user: user}, function (e, o) {
		if (o == null) {


			callback('user-not-found');
		} else {
			validatePassword(pass, o.pass, function (err, res) {
				if (res) {
					callback(null, o);
				} else {
					callback('invalid-password');
				}
			});
		}
	});*/

	console.log("outside passport")
	console.log("the params are")
	console.log(user)
	console.log(pass)
		passport.use('/login',new LocalStrategy({usernameField: 'user',
			passwordField: 'pass'},function(user, pass, cb) {
			console.log("inside passport")
				console.log("account manager.js")
				console.log(user)
				console.log(pass)
				accountModel.accounts.findOne({user:user},function(err,user){


				//accountModel.accounts.findOne(username, function(err, user) {
					console.log("the value of user variable is")
					console.log(user)
					if (err) { return cb(err); }
					if (!user)  callback('user-not-found'); //{ return cb(null, false); }
					if (user.password != password) callback('invalid-password');//{ return cb(null, false); }
					return cb(null, user);
				});
			}));



	/*passport.use(new LocalStrategy(function(username,password,done){
		console.log("inside passport")
		accountModel.accounts.findOne({user:username},function(err,user){
			if (err) { return done(err); }
			if (!user) { return done(null, false); }
			return done(null,user)

		})
	}))*/



}

passport.serializeUser(function(user, cb) {
	console.log("serialized")
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	console.log("Deserialized")
	db.accounts.findById(id, function (err, user) {
		if (err) { return cb(err); }
		cb(null, user);
	});
});


/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
	accountModel.accounts.findOne({user:newData.user}, function(e, o) {
		if (o){
			callback('username-taken');
		}	else{
			accountModel.accounts.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken');
				}	else{
					saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						accounts.insert(newData, {safe: true}, callback);
					});
				}
			});
		}
	});
}




exports.updateAccount = function(newData, callback)
{
	accountModel.accounts.findOne({_id:getObjectId(newData.id)}, function(e, o){
		o.name 		= newData.name;
		o.email 	= newData.email;
		o.country 	= newData.country;
		if (newData.pass == ''){
			accounts.save(o, {safe: true}, function(e) {
				if (e) callback(e);
				else callback(null, o);
			});
		}	else{
			saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				accounts.save(o, {safe: true}, function(e) {
					if (e) callback(e);
					else callback(null, o);
				});
			});
		}
	});
}

exports.updatePassword = function(email, newPass, callback)
{
	accountModel.accounts.findOne({email:email}, function(e, o){
		if (e){
			callback(e, null);
		}	else{
			saltAndHash(newPass, function(hash){
		        o.pass = hash;
		        accounts.save(o, {safe: true}, callback);
			});
		}
	});
}

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	accountModel.accounts.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	accountModel.accounts.findOne({email:email}, function(e, o){ callback(o); });
}

exports.validateResetLink = function(email, passHash, callback)
{
	accountModel.accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback)
{
	accountModel.accounts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

exports.delAllRecords = function(callback)
{
	accountModel.accounts.remove({}, callback); // reset accounts collection for testing //
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
}

var findById = function(id, callback)
{
	accountModel.accounts.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	accountModel.accounts.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
