 var express = require('express');
 var app = express(); // create our app w/ express
 var sql = require('sql'); // mongoose for mongodb
 var morgan = require('morgan'); // log requests to the console (express4)
 var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
 var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.listen(3000);
console.log("Server running on port 3000");