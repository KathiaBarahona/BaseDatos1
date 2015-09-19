 var express = require('express');
 var app = express(); // create our app w/ express
 var morgan = require('morgan'); // log requests to the console (express4)
 var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
 var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
 var sql = require('mssql'); //conexion con sql server

 app.use(bodyParser.json());
 app.use(express.static(__dirname + "/public"));

 var config = {
     user: 'sa',
     password: 'jblazo123456',
     server: 'localhost',
     database: 'Hospital',
 }


 var current_doctor = "";
 var autenticado = false;

 app.post('/logout', function(req, res) {
     if (autenticado) {
         autenticado = false;
         current_doctor = "";
     }
 });

 app.post('/login', function(req, res) {
     autenticado = false;
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             console.log(err);
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select id_doctor,password from Doctores where id_doctor='" + req.body.id_doctor + "' and password='" + req.body.password + "'", function(err, recordset) {
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
             console.log(err);
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("insert into Doctores values('" + req.body.id_doctor + "','" + req.body.nombres + "','" + req.body.apellidos + "'," + req.body.honorarios + ",'" + req.body.password + "')",
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

 app.post('/citas', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             console.log(err);
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select * from Citas where id_doctor = '" + req.body.id_doctor + "'",
                 function(err, recordset) {
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


 app.post('/registro', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             console.log(err);
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("insert into Registros(id_paciente,id_doctor,tipo,motivo,diagnostico) values('" + req.body.id_paciente + "','" + req.body.id_doctor + "','" + req.body.tipo + "','" + req.body.motivo + "','" + req.body.diagnostico + "')",
                 function(err, recordset) {
                     if (err) {
                         console.log(req)
                         console.log(err)
                         console.log("Error query1");
                         res.status(400).end();
                     } else {
                         var request2 = connection.request();
                         request2.query("select id_registro from Registros where id_paciente = '" + req.body.id_paciente + "' AND id_doctor = '" + req.body.id_doctor + "' AND tipo = '" + req.body.tipo + "' AND motivo = '" + req.body.motivo + "' AND diagnostico = '" + req.body.diagnostico + "'",
                             function(err, recordset2) {
                                 if (err) {
                                     console.log("Error query2");
                                     res.status(400).end();
                                 } else {
                                     var request3 = connection.request();
                                     request3.query("insert into Cuentas(id_paciente,id_doctor,id_registro) values ('" + req.body.id_paciente + "','" + req.body.id_doctor + "'," + recordset2[0].id_registro + ")",
                                         function(err, recordset3) {
                                             if (err) {
                                                 //console.log(recordset2[0].id_registro);
                                                 console.log("Error query3");
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

 app.get('/pacientes', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select id_paciente,nombres,apellidos from Pacientes", function(err, recordset) {
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

 app.post('/registros', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select * from Registros where id_paciente = '" + req.body.id_paciente + "'", function(err, recordset) {
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

 app.post('/sintomas', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();

             request.query("select sintoma from Registro_Sintomas where id_registro='" + req.body.id_registro + "'", function(err, recordset) {
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

 app.post('/medicamentos', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select medicamento from Registro_Medicamentos where id_registro='" + req.body.id_registro + "'", function(err, recordset) {
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

 app.post('/sintoma', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             req.body.sintomas.forEach(function(entry) {
                 request.query("insert into Registro_Sintomas values ((SELECT TOP 1 id_registro FROM Registros " +
                     "ORDER BY id_registro DESC), '" + req.body.id_paciente + "', '" + entry + "')",
                     function(err, recordset) {
                         if (err) {
                             console.log("Error query");
                             res.status(400).end();
                         } else {
                             res.status(200).end();
                         }
                     });


             })
         }
     })
 })



 app.post('/cuenta', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             var query = "select Cuentas.*,Pacientes.nombres AS nombrePac,Pacientes.apellidos AS apellidoPac,Doctores.honorarios,Doctores.nombres AS nombreDoc,Doctores.apellidos AS apellidoDoc from Cuentas " +
                 "inner join Pacientes on Pacientes.id_paciente = Cuentas.id_paciente " +
                 "inner join Doctores on Doctores.id_doctor = Cuentas.id_doctor " +
                 "where Cuentas.id_registro = '" + req.body.id_registro + "'"
             request.query(query, function(err, recordset) {
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
 app.post('/historial', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             var query = "select Registros.*,Doctores.nombres,Doctores.apellidos from Registros " +
                 "inner join Pacientes on Pacientes.id_paciente = Registros.id_paciente " +
                 "inner join Doctores on Doctores.id_doctor = Registros.id_doctor " +
                 "where Registros.id_paciente = '" + req.body.id_paciente + "'";
             request.query(query, function(err, recordset) {
                 if (err) {
                     console.log(err)
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
 app.post('/medicamento', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             req.body.medicinas.forEach(function(entry) {
                 request.query("insert into Registro_Medicamentos values ((SELECT TOP 1 id_registro FROM Registros " +
                     "ORDER BY id_registro DESC), '" + req.body.id_paciente + "', '" + entry + "')",
                     function(err, recordset) {
                         if (err) {
                             console.log("Error query");
                             res.status(400).end();
                         } else {
                             res.status(200).end();
                         }
                     });


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
             request.query("select * from Examenes where id_examen in (select id_examen from Paciente_Examenes where id_registro = '" + req.body.id_registro + "')", function(err, recordset) {
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
