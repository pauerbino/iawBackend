var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

const cors = require('cors');


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/marketingDB', {useMongoClient: true})
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

var lists = require('./routes/lists');
var contacts = require('./routes/contacts');
var campaigns = require('./routes/campaigns');
var users = require('./routes/users');
var register = require('./routes/register');
var app = express();
app.use(cors());

app.use(passport.initialize());
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/v1/lists', lists);
app.use('/api/v1/contacts', contacts);
app.use('/api/v1/campaigns', campaigns);
app.use('/api/v1/users', users);
app.use('/api/v1/register', register);

require('./config/passport');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;











// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

// const cors = require('cors');

// const app = express();
// app.use(cors());

// var contacts = require('./routes/contacts');
// var lists = require('./routes/lists');
// var campaigns = require('./routes/campaigns');

// // var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/unTestDB";

// var mongoose       = require('mongoose');

// // MongoClient.connect(url, function(err, db) {
// //   if (err) throw err;
// //   console.log("Database created!");
// //   var collection = db.createCollection("personas", function(err, res) {
// //     if (err) throw err;
// //     console.log("Collection created!");
// //     res.find({'nombre': 'paku'}).toArray(function(err, docs) {
// //     	console.dir(docs);
// //   		db.close();
// // 	});
// //     db.close();
// //   });
// // });

// app.use('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser())

// app.use('/api/v1/contacts', contacts);
// app.use('/api/v1/lists', lists);
// app.use('/api/v1/campaigns', campaigns);

// module.exports = app;
