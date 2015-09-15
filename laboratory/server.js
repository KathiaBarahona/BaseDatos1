 var express = require('express');
 var app = express(); // create our app w/ express
 var morgan = require('morgan'); // log requests to the console (express4)
 var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
 var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var sql = require('mssql');//conexion con sql server

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

var config = {
    user: 'xavier_2696',
    password: 'j8r74e3h',
    server: 'localhost', 
    database: 'Hospital',   
}

var current_user = "";
var autenticado = false;

app.post('/logout' ,function(req, res){
	if(autenticado){
		autenticado = false;
		current_user = "";		
	}
});

app.post('/login', function (req,res){	 
    autenticado = false;
	var connection = new sql.Connection(config, function(err) {
		if (err) {
        	console.log("Error conexion");
        	res.status(400).end();
    	}else{
    		var request = connection.request();
    		request.query('select id_usuario,contraseña from Doctores', function(err, recordset) {
    			if (err) {
        			console.log("Error query");
        			res.status(400).end();
    			}else{    				
    				recordset.forEach(function(entry) {
    					if(entry.id_usuario == req.body.id_usuario && entry.contraseña == req.body.contraseña){
    						autenticado = true;
    						current_user = entry.id_usuario;
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

app.post('/registry', function(req,res){
	var connection = new sql.Connection(config, function(err) {
		if (err) {
        	console.log("Error conexion");
        	res.status(400).end();
    	}else{
    		var request = connection.request();
    		request.query("insert into Usuarios values('"+req.body.id_usuario+"','"+req.body.contraseña+"')", 
    			function(err, recordset) {
    			if (err) {
        			console.log("Error query");
        			res.status(400).end();
    			}else{
    				res.status(200).end();
    			}
        		
    		});
    	}
	});
});

app.listen(3000);
console.log("Server running on port 3000");