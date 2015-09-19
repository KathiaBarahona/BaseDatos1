 var express = require('express');
 var app = express(); // create our app w/ express
 var morgan = require('morgan'); // log requests to the console (express4)
 var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
 var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
 var sql = require('mssql'); //conexion con sql server

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

 app.post('/logout', function(req, res) {
     if (autenticado) {
         autenticado = false;
         current_user = "";
     }
 });

 app.post('/login', function(req, res) {
     autenticado = false;
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select id_usuario,password from Usuarios where id_usuario='" + req.body.id_usuario + "' and password='" + req.body.password + "'", function(err, recordset) {
                 if (err) {
                     console.log("Error query");
                     res.status(400).end();
                 } else {

                     if (recordset.length != 0) {
                         //res.redirect('/registry');
                         res.send("existe");
                         res.status(200).end();
                     } else {
                         console.log("no encontrado");
                         //res.redirect('/login');
                         res.status(401).end();
                     }
                 }
             });
         }
     });

 });

 app.post('/registry', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("insert into Usuarios values('" + req.body.id_usuario + "','" + req.body.password + "')",
                 function(err, recordset) {
                     if (err) {
                         console.log("Error query");
                         res.status(400).end();
                     } else {
                         res.status(200).end();
                     }

                 });
         }
     });
 });

app.post('/examen', function(req, res){
    var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("insert into Examenes values('" + req.body.id_examen + "','" + req.body.tipo+ "','" + req.body.costo + "')",
                 function(err, recordset) {
                     if (err) {
                         console.log("Error query");
                         res.status(400).end();
                     } else {
                         res.status(200).end();
                     }

                 });
         }
     });
});

 app.get('/examenes', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select * from Examenes " , function(err, recordset) {
                 if (err) {
                     console.log("Error query");
                     res.status(400).end();
                 } else {
                     res.contentType('application/json');
                     res.send(JSON.stringify(recordset));
                     res.status(200).end();
                 }

             });
         }
     });
 });

app.post('/paciente_examen', function(req, res){
    var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("insert into Paciente_Examenes(id_examen,id_paciente,id_registro) values('" + req.body.id_examen + "','" + req.body.id_paciente+ "','" + req.body.id_registro+ "')",
                 function(err, recordset) {
                     if (err) {
                         console.log("Error query 1");
                         res.status(400).end();
                     } else {
                        var request2 = connection.request();
                        request2.query("select num_factura from Cuentas where id_registro = '"+req.body.id_registro+"'",
                            function(err, recordset2) {
                                if (err) {
                                    console.log("Error query 2");
                                    res.status(400).end();
                                } else {
                                    var request3 = connection.request();
                                    request3.query("update Paciente_Examenes set num_factura = '"+recordset2[0].num_factura
                                        +"' where id_examen = '"+req.body.id_examen+"' AND id_paciente = '"+req.body.id_paciente+"' AND id_registro = '"+req.body.id_registro+"'",
                                        function(err, recordset3) {
                                            if (err) {
                                                console.log("Error query 3");
                                                res.status(400).end();
                                            } else {                        
                                                res.status(200).end();
                                            }
                                    });
                                }

                         });
                     }

                 });
         }
     });
});

app.post('/cuenta', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             var query = "select Cuentas.*,Pacientes.nombres AS nombrePac,Pacientes.apellidos AS apellidoPac,Doctores.honorarios,Doctores.nombres AS nombreDoc,Doctores.apellidos AS apellidoDoc from Cuentas "+
             "inner join Pacientes on Pacientes.id_paciente = Cuentas.id_paciente "+
             "inner join Doctores on Doctores.id_doctor = Cuentas.id_doctor "+
             "where Cuentas.id_registro = '" + req.body.id_registro + "'"
             request.query(query, function(err, recordset) {
                 if (err) {
                     console.log("Error query");
                     console.log(err)
                     res.status(400).end();
                 } else {
                     res.contentType('application/json');
                     res.send(JSON.stringify(recordset));
                     res.status(200).end();
                 }

             });
         }
     });
 });

 app.post('/examenes', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select * from Examenes where id_examen=(select id_examen from Paciente_Examenes where id_registro = '" + req.body.id_registro + "')", function(err, recordset) {
                 if (err) {
                     console.log("Error query");
                     res.status(400).end();
                 } else {
                     res.contentType('application/json');
                     res.send(JSON.stringify(recordset));
                     res.status(200).end();
                 }

             });
         }
     });
 });

 app.get('/pacientes', function(req, res){
    var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select id_paciente,nombres,appellidos from Pacientes" , function(err, recordset) {
                 if (err) {
                     console.log("Error query");
                     res.status(400).end();
                 } else {
                     res.contentType('application/json');
                     res.send(JSON.stringify(recordset));
                     res.status(200).end();
                 }

             });
         }
     });
 });

 app.post('/registros', function(req, res){
    var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select * from Registros where id_paciente = '"+req.body.id_paciente+"'" , function(err, recordset) {
                 if (err) {
                     console.log("Error query");
                     res.status(400).end();
                 } else {
                     res.contentType('application/json');
                     res.send(JSON.stringify(recordset));
                     res.status(200).end();
                 }

             });
         }
     });
 });




 app.listen(3000);
 console.log("Server running on port 3000");
