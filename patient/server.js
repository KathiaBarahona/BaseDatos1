 var express = require('express');
 var app = express(); // create our app w/ express
 var morgan = require('morgan'); // log requests to the console (express4)
 var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
 var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var sql = require('mssql');//conexion con sql server

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

var config = {
    user: 'sa',
    password: 'jblazo123456',
    server: 'localhost', 
    database: 'Hospital',   
}

var current_patient = "";
var autenticado = false;

app.post('/logout' ,function(req, res){
    if(autenticado){
        autenticado = false;
        current_patient = "";        
    }
});

app.post('/login', function (req,res){   
    autenticado =false;
    var connection = new sql.Connection(config, function(err) {
        if (err) {
            console.log(err)
            console.log("Error conexion");
            res.status(400).end();
        }else{
            var request = connection.request();
            request.query('select id_paciente,password from Pacientes', function(err, recordset) {
                if (err) {
                    console.log("Error query");
                    res.status(400).end();
                }else{                    
                    recordset.forEach(function(entry) {
                        if(entry.id_paciente == req.body.id_paciente && entry.password == req.body.password){
                            autenticado = true;
                            current_patient = entry.id_paciente;
                        }
                    });
                    if (autenticado){
                        //res.redirect('/registry');
                        res.status(200).end();                      
                    }else{
                        console.log("no encontrado");
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
            request.query("insert into Pacientes values('"+req.body.id_paciente+"','"+req.body.nombres+"','"+req.body.apellidos+"','"
                            +req.body.contac_emer+"','"+req.body.ocupacion+"','"+req.body.email+"','"+req.body.fecha_nac+"','"
                            +req.body.estado_marital+"','"+req.body.sexo+"','"+req.body.tipo_sangre+"','"+req.body.direccion+"','"
                            +req.body.fecha_registro+"','"+req.body.password+"')", 
                function(err, recordset) {
                if (err) {
                    console.log("Error query");
                    res.status(400).end();
                }else{
                    res.status(200).end();
                }
                
            });
            /*console.log("insert into Pacientes values('"+req.body.id_paciente+"','"+req.body.nombres+"','"+req.body.apellidos+"','"
                            +req.body.contac_emer+"','"+req.body.ocupacion+"','"+req.body.email+"','"+req.body.fecha_nac+"','"
                            +req.body.estado_marital+"','"+req.body.sexo+"','"+req.body.tipo_sangre+"','"+req.body.direccion+"','"
                            +req.body.fecha_registro+"','"+req.body.contraseña+"')");*/
        }
    });
});

app.listen(3000);
console.log("Server running on port 3000");

