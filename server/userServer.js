var express = require('express'); 
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var path = require('path');
var Promise = require('bluebird');
// var User = require('./userHandlers/userHandlers');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/peacefulSplinter');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("DB opened!");
});

var User = require('./db/schema.js');

var port = process.env.PORT || 3000;
var host = process.env.host || '127.0.0.1';

app.use(express.static(__dirname + '/test.html'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({secret: 'shhhh', saveUninitialized: true,
                 resave: true}));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/test.html'); // home page
});

app.post('/', function (req, res) {
 // creates new user instance
 var username = req.body.username;
 var password = req.body.password;

 var userQuery = User.where({username: username});
 userQuery.findOne(function(err, user){
	console.log(user);
	if (err) throw err;
	if (user) {
		 console.log('user exists!');
    else {
		  new User({
		  	username: username,
		  	password: password
		  }).save();
      	}
       }
	  }
    if (!user) {
     bcrypt.genSalt(10, function (error, result) {
       bcrypt.hash(password, result, null, function (err, hash) {
         User.save({
             username: username,
             salt: result,
             password: hash
           })
           .complete(function (err, user) {
             if (!!err) {
               console.log('An error occurred while creating the table: user.create', err);
             } else {
               console.log('made it to DB!');
               res.redirect('/');
             }
           });
       });
     });
   }
 });

});


http.listen(port, function () {
  console.log('Server now listening on port ' + port);
});