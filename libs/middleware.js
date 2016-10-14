var nJwt = require('njwt');

var config = require('../libs/config');
var userModel = require('../models/user');
var userError = require('../libs/errors/userError');
var authError = require('../libs/errors/userError').authenticationError;
var userNotLoggedIn = require('../libs/errors/userError').userNotLoggedIn;
var noSuchUser = require('../libs/errors/userError').noSuchUser;

function fetchUserByID(userID, projection, callback) {
    var query = {_id: userID};
    userModel.user.findOne(query, projection, function(err, userData) {
        if(err) {
            return callback(err);
        }
        else {
            return callback(null, userData);
        }
    });
}

function validateAccessToken(accessToken, callback) {
    try {
        var accessTokenSplit = accessToken.split(" ");
        var tokenType = accessTokenSplit[0];
        var token = accessTokenSplit[1]
    }
    catch (err) {
        // no/bad accessToken
        return callback(new authError("No/Bad authorization header"));
    }

    if(tokenType.toLowerCase() != "bearer") {
        return callback(new authError("Bad token type"));
    }
    if(!token) {
        return callback(new authError("No/Bad token"));
    }

    var verifiedJwt = nJwt.verify(token, config.get("application:secret"), function(err, jwt) {
        if (err) {
            //err.message == "Jwt is expired" - access token has expired, signout and sign in again - client side
            if(err.userMessage == "Jwt is expired") {
                var userID = err.parsedBody.sub;
                return callback(new authError(err.userMessage), {userID: userID})
            }
            else {
                return callback(new authError(err.userMessage));
            }
        }
        // if valid, get userID from jwt and append it to request, and proceed to next middleware
        else {
            var userID = jwt.body.sub;
            var deviceID = jwt.body.deviceID;

            userModel.user.findOne({_id:userID}, function(errFindingUser,userFound){
                if(errFindingUser){
                    return callback(new userError.internalError());
                }
                else if(!userFound){
                    return callback(new userError.noSuchUser());
                }
                else {
                    var deviceInfo = userFound.deviceInfo;
                    var currentDevice = deviceInfo.filter(function (device) {
                        return device.id == deviceID;
                    });
                    if(currentDevice.length!=0){
                        currentDevice = currentDevice[0];
                        var index = deviceInfo.indexOf(currentDevice);
                        if(deviceInfo[index].activeStatus == 1){
                            return callback(null, {userID: userID});
                        }
                        else if(deviceInfo[index].activeStatus == 0){
                            return callback(new authError("your jwt has expired"));
                        }
                    }
                    else {
                        return callback(new authError());
                    }
                }
            });
        }
    });
}

//Public
// Check if access token is valid
function authenticate(req, res, next) {
    var accessToken = req.headers.authorization;

    validateAccessToken(accessToken, function(err, validateAccessTokenData) {
        if(err) {
            // Allow user to signout if his access token is expired.
            if(req.url == "/signout" && err.message == "Jwt is expired") {
                req.userID = validateAccessTokenData.userID;
                next();
            }
            else {
                return next(err);
            }
        }
        else {
            req.userID = validateAccessTokenData.userID;
            next();
        }
    });
}

// Checks if user is valid and can make a request(he should be signedin)
function validateRequest(req, res, next) {
    var userID = req.userID;
    var projection = {_id: 1, profileStatus:1};

    //TODO: validate the request body and query.
    fetchUserByID(userID, projection, function(err, userData){
        if(err) {
            return next(err);
        }
        else if(!userData) {
            return next(new noSuchUser());
        }
        else {
            var signedinStatus = [11, 21, 31];
            var profileStatus = userData.profileStatus;
            if (signedinStatus.indexOf(profileStatus) == -1) {
                return next(new userNotLoggedIn(profileStatus));
            }
            else {
                next();
            }
        }
    });
}

exports.authenticate = authenticate;
exports.validateRequest = validateRequest;