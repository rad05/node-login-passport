var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var accountSchema = new Schema({
    name : String,
    email : String,
    user: String,
    pass: String,
    country:String,
 },
    {
        timestamps: true
});

/*
 var adminUsers = mongoose.model('adminUsers',adminSchema,"adminUsers");

 exports.adminUsers = adminUsers;
 */

accountSchema.plugin(passportLocalMongoose);
var accounts = mongoose.model('accounts', accountSchema,'accounts')
exports.accounts=accounts
//module.exports = mongoose.model('account', accountSchema,'account');

