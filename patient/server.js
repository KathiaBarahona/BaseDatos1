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

 var current_patient = "";
 var autenticado = false;

 app.post('/logout', function(req, res) {
     if (autenticado) {
         autenticado = false;
         current_patient = "";
     }
 });

 app.post('/login', function(req, res) {
     autenticado = false;
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log(err)
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query('select id_paciente,password from Pacientes', function(err, recordset) {
                 if (err) {
                     console.log("Error query");
                     res.status(400).end();
                 } else {
                     recordset.forEach(function(entry) {
                         if (entry.id_paciente == req.body.id_paciente && entry.password == req.body.password) {
                             autenticado = true;
                             current_patient = entry.id_paciente;
                         }
                     });
                     if (autenticado) {
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
             request.query("insert into Pacientes values('" + req.body.id_paciente + "','" + req.body.nombres + "','" + req.body.apellidos + "','" + req.body.contac_emer + "','" + req.body.ocupacion + "','" + req.body.email + "','" + req.body.fecha_nac + "','" + req.body.estado_marital + "','" + req.body.sexo + "','" + req.body.tipo_sangre + "','" + req.body.direccion + "','" + req.body.fecha_registro + "','" + req.body.password + "')",
                 function(err, recordset) {
                     if (err) {
                         console.log("Error query");
                         res.status(400).end();
                     } else {
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

 app.get('/doctores', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select id_doctor, nombres, apellidos from Doctores", function(err, recordset) {
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

 app.post('/appointment', function(req, res) {

     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select id_doctor,fecha from Citas", function(err, recordset) {
                 //request.query("insert into Citas values('"+req.body.id_doctor+"','"+current_patient+"','"
                 //                +req.body.fecha+"','"+req.body.motivo+"')",function(err, recordset) {
                 if (err) {
                     console.log("Error query");
                     res.status(400).end();
                 } else {
                     recordset.forEach(function(entry) {
                         if (entry.id_doctor == req.body.id_doctor && entry.fecha == req.body.fecha) {
                             res.status(400).end();
                         }
                     });
                 }

             });
             var request1 = connection.request();
             request1.query("insert into Citas values('" + req.body.id_doctor + "','" + req.body.id_paciente + "','" + req.body.fecha + "','" + req.body.motivo + "')", function(err, recordset) {
                 if (err) {
                     console.log("Error query");
                     console.log(err)
                     res.status(400).end();
                 } else {
                     res.status(200).end();
                 }
             });
         }
     });
 });

 app.post('/historial', function(req, res) {
     console.log(req)
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select * from Registros where id_paciente='" + req.body.id_paciente + "'", function(err, recordset) {
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


 app.post('/cuenta', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select * from Cuentas where id_registro='" + req.body.id_registro + "'", function(err, recordset) {
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

 app.post('/telefono', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("insert into Paciente_Telefonos values('" + current_patient + "','" + req.body.telefono + "')", function(err, recordset) {
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

 app.post('/enfermedad', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("insert into Paciente_Enfermedades values('" + current_patient + "','" + req.body.enfermedad + "')", function(err, recordset) {
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

 app.post('/telefonos', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select telefono  from Paciente_Telefonos where id_paciente='" + current_patient + "'", function(err, recordset) {
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

 app.post('/enfermedades', function(req, res) {
     var connection = new sql.Connection(config, function(err) {
         if (err) {
             console.log("Error conexion");
             res.status(400).end();
         } else {
             var request = connection.request();
             request.query("select enfermedad from Paciente_Enfermedades where id_paciente='" + current_patient + "'", function(err, recordset) {
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
