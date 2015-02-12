var express = require('express'); 
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var path = require('path');
var Promise = require('bluebird');
// var User = require('./userHandlers/userHandlers');
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

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/test.html'); //home page
});

app.post('/', function (req, res) {

  var user = new User({
  	username: req.body.username,
  	password: req.body.password
  });

  user.save(function(err, user){
  	if (err) throw err;
  })
});

// PASSPORT LOGIC
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

// app.use(passport.initialize());
// app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

app.post('/', passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true }));


// // takes to login page (client side)
// app.get('/auth/provider',
//   passport.authenticate('provider')
// );

// // instaniating a new provider - house data that we get from provider
// passport.use('provider', new OAuth2Strategy({
//     authorizationURL: 'https://www.provider.com/oauth2/authorize',
//     tokenURL: 'https://www.provider.com/oauth2/token',
//     clientID: '123-456-789',
//     clientSecret: 'shhh-its-a-secret',
//     callbackURL: '/auth/provider/callback'
//   },
//   function(accessToken, refreshToken, profile, done) {
//   	console.log(accessToken, refreshToken, profile, done);
//   }
// ));

// // authenticate user
// app.get('/auth/provider/callback', 
//   passport.authenticate('provider', { successRedirect: '/',
//                                       failureRedirect: '/login' }));

http.listen(port, function () {
  console.log('Server now listening on port ' + port);
});