var mongoose = require('mongoose');

// package to encrypt passwords
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var userSchema = new Schema({

	username: String,
	password: String,
	salt: String

});

var User = mongoose.model('User', userSchema);

module.exports = User;