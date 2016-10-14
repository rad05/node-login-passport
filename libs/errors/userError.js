var util = require("util");

function userExist(message,status) {
    /*INHERITANCE*/
    Error.call(this); //super constructor
    Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

    //Set the name for the ERROR
    this.name = this.constructor.name; //set our function’s name as error name.
    this.status = status || 500;
    this.message = message || "User already exists";
}

function mobileNumTaken(message) {
    /*INHERITANCE*/
    Error.call(this); //super constructor
    Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

    //Set the name for the ERROR
    this.name = this.constructor.name; //set our function’s name as error name.

    this.message = message || "This mobile number is already taken";
}

function noSuchUser(message,status) {
    /*INHERITANCE*/
    Error.call(this); //super constructor
    Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

    //Set the name for the ERROR
    this.name = this.constructor.name; //set our function’s name as error name.
    this.status= status || 500;
    this.message = message || "no such user exists";
}

function incorrectOtp(message) {
    /*INHERITANCE*/
    Error.call(this); //super constructor
    Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

    //Set the name for the ERROR
    this.name = this.constructor.name; //set our function’s name as error name.

    this.message = message || "the otp you entered is incorrect";
}

function userNotLoggedIn(profileStatus) {
    /*INHERITANCE*/
    Error.call(this); //super constructor
    Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

    //Set the name for the ERROR
    this.name = this.constructor.name; //set our function’s name as error name.

    this.message = "User is not logged in. (" + profileStatus + ")";
}

function authenticationError(message) {
    /*INHERITANCE*/
    Error.call(this); //super constructor
    Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

    //Set the name for the ERROR
    this.name = this.constructor.name; //set our function’s name as error name.
    this.status = 401;
    this.message = message || "Unauthorized";
}

function internalError(message) {
    /*INHERITANCE*/
    Error.call(this); //super constructor
    Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

    //Set the name for the ERROR
    this.name = this.constructor.name; //set our function’s name as error name.

    this.message = message||"some internal error";
}

function noRegID() {
    /*INHERITANCE*/
    Error.call(this); //super constructor
    Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

    //Set the name for the ERROR
    this.name = this.constructor.name; //set our function’s name as error name.

    this.message = " regID is not set";
}

function uploadFileTypeError() {
    /*INHERITANCE*/
    Error.call(this); //super constructor
    Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

    //Set the name for the ERROR
    this.name = this.constructor.name; //set our function’s name as error name.

    this.message = "only pdf file or image should be uploaded";
}




util.inherits(userExist, Error);
util.inherits(mobileNumTaken, Error);
util.inherits(noSuchUser, Error);
util.inherits(incorrectOtp, Error);
util.inherits(authenticationError, Error);
util.inherits(userNotLoggedIn, Error);
util.inherits(internalError, Error);
util.inherits(noRegID,Error);
util.inherits(uploadFileTypeError,Error);


exports.userExist = userExist;
exports.mobileNumTaken = mobileNumTaken;
exports.noSuchUser = noSuchUser;
exports.incorrectOtp = incorrectOtp;
exports.authenticationError = authenticationError;
exports.userNotLoggedIn = userNotLoggedIn;
exports.internalError = internalError;
exports.noRegID = noRegID;
exports.uploadFileTypeError = uploadFileTypeError;

