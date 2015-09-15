 var express = require('express');
 var app = express(); // create our app w/ express
 var morgan = require('morgan'); // log requests to the console (express4)
 var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
 var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var sql = require('mssql');//conexion con sql server

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.listen(3000);
console.log("Server running on port 3000");

var config = {
    user: 'xavier_2696',
    password: 'j8r74e3h',
    server: 'localhost', 
    database: 'Hospital',   
}

var current_patient = "";
var autenticado = false;

app.post('/login', function (req,res){	 
	var connection = new sql.Connection(config, function(err) {
		if (err) {
        	console.log("Error opening the connection");
        	res.status(401).end();
    	}else{
    		var request = connection.request();
    		request.query('select id_paciente,contraseña from Pacientes', function(err, recordset) {
    			if (err) {
        			console.log("Error executing the query");
        			res.status(401).end();
    			}else{
    				
    				recordset.forEach(function(entry) {
    					if(entry.id_paciente == req.body.username && entry.contraseña == req.body.password){
    						autenticado = true;
    						current_doctor = entry.id_doctor;
    					}
					});
					if (autenticado){
						//res.redirect('/registry');
						res.status(200).end();						
					}else{
						//res.redirect('/login');
						res.status(401).end();						
					}
    			}
        		
    		});
    	}
	});

});