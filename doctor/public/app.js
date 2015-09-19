'use strict';
angular.module('doctorApp', ['ui-notification', 'ui.router'])

.config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 1500,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'left',
            positionY: 'bottom'
        });
    })
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('registry', {
                    url: '/registry/:doctorID',
                    templateUrl: 'views/registry.view.html',
                    controller: 'registryCtrl'
                })
                .state('appointments', {
                    url: '/appointments/:doctorID',
                    templateUrl: 'views/appointments.view.html',
                    controller: 'appointmentsCtrl'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.view.html',
                    controller: 'loginCtrl'
                })
                .state('patients', {
                    url: '/patients/:doctorID',
                    templateUrl: 'views/tablapacientes.view.html',
                    controller: 'patientCtrl'
                })
                .state('historial', {
                    url: '/historial/:doctorID/:patientID',
                    templateUrl: 'views/historial.view.html',
                    controller: 'historialCtrl'
                })


            $urlRouterProvider.otherwise('login');
        }
    ])
    .directive('navbar', function() {
            return {
                restrict: 'E',
                templateUrl: 'views/navbar.view.html',
                controller: function($scope, $stateParams) {

                    $scope.redirect = function(value) {
                        if (value == 0) {
                            var url = "#/registry/" + $stateParams.doctorID
                            window.location.href = url;
                        }
                        if (value == 1) {
                            var url = "#/appointments/" + $stateParams.doctorID
                            window.location.href = url;
                        }
                        if (value == 2) {
                            $('#sidebar-wrapper').hide()
                            window.location.href = '#/login'
                        }
                        if (value == 3) {
                            var url = "#/patients/" + $stateParams.doctorID
                            window.location.href = url;
                        }

                    }
                }
            }
        }

    )
    .controller('historialCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {

        $scope.registries;
        $scope.symptoms;
        $scope.medicines;
        $scope.exams;
        $scope.bills;
        $scope.total = 0;
        $http.post('/historial', {
            "id_paciente": $stateParams.patientID
        }).success(function(response) {
            $scope.registries = response;

        });
        $scope.verFacturas = function(value) {
            $http.post('/cuenta', {
                "id_registro": value
            }).success(function(response) {
                $scope.bills = response;
                if ($scope.exams == undefined)
                    $scope.verExamenes(value);



            });
        }
        $scope.verExamenes = function(value) {
            $http.post('/examenes', {
                "id_registro": value
            }).success(function(response) {
                $scope.exams = response;
                $scope.total = 0;
                $.each($scope.exams, function(index, element) {
                    $scope.total += element.costo;
                });
                $scope.total += $scope.bills[0].honorarios;
            });
        }

        $scope.verMedicamentos = function(value) {
            $http.post('/medicamentos', {
                "id_registro": value
            }).success(function(response) {
                $scope.medicines = response;
            });
        }
        $scope.verSintomas = function(value) {
            $http.post('/sintomas', {
                "id_registro": value
            }).success(function(response) {
                $scope.symptoms = response;
            });
        }
    }])
    .controller('patientCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $scope.doctorId = $stateParams.doctorID
        if ($scope.doctorId == '' || $scope.doctorId == 'undefined') {
            window.location.href = "#/login"
        } else {
            $('#sidebar-wrapper').show();
        }
        $scope.patients;
        $http.get('/pacientes').success(function(response) {
            $scope.patients = response;
        })
        $scope.redirect = function(value) {
            var url = "#/historial/" + $stateParams.doctorID + '/' + value;
            window.location.href = url;

        }
    }])
    .controller('registryCtrl', ['$scope', '$http', '$stateParams','Notification', function($scope, $http, $stateParams,Notification) {
        $scope.doctorId = $stateParams.doctorID
        $scope.registry;
        $scope.sintomas = [];
        $scope.medicinas = [];
        if ($scope.doctorId == '' || $scope.doctorId == 'undefined') {
            window.location.href = "#/login"
        } else {
            $('#sidebar-wrapper').show();
        }
        $http.get('/pacientes').success(function(response) {
            $.each(response, function(i, item) {
                $('#pacientesel').append($('<option>', {
                    value: item.id_paciente,
                    text: item.nombres + ' ' + item.apellidos
                }))
            });
        })
        $scope.agregarRegistro = function() {
            $http.post('/registro', {
                'id_paciente': $scope.registry.id_paciente,
                'id_doctor': $scope.doctorId,
                'tipo': $scope.registry.tipo,
                'motivo': $scope.registry.motivo,
                'diagnostico': $scope.registry.diagnostico
            }).success(function(response) {

                $.each($('.sintomas').children(), function(index, element) {
                    $scope.sintomas.push($(element).text());
                })
                $http.post('/sintoma', {
                    'id_paciente': $scope.registry.id_paciente,
                    'sintomas': $scope.sintomas
                }).success(function(response) {


                })
                $.each($('.medicamentos').children(), function(index, element) {
                    $scope.medicinas.push($(element).text())
                });
                $http.post('/medicamento', {
                    'id_paciente': $scope.registry.id_paciente,
                    'medicinas': $scope.medicinas
                }).success(function(response) {
                    Notification.success('El registro fue agregado exitosamente');
                })
            })
        }



    }])
    .controller('appointmentsCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $scope.doctorId = $stateParams.doctorID
        if ($scope.doctorId == '' || $scope.doctorId == 'undefined') {
            window.location.href = "#/login"
        } else {
            $('#sidebar-wrapper').show();
        }
        $scope.appointments;
        $http.post('/citas', {
            "id_doctor": $scope.doctorId
        }).success(function(response) {
            $scope.appointments = response;
        })

    }])
    .controller('loginCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {

        $scope.doctor = {};
        $scope.login = function() {
            $scope.doctor.id_doctor = 'D' + $scope.doctor.id_doctor;
            $http.post('/login', {
                "id_doctor": $scope.doctor.id_doctor,
                "password": $scope.doctor.password
            }).success(function(response) {
                if (response == 'existe') {
                    window.location.href = "#/registry/" + $scope.doctor.id_doctor;
                    $('#sidebar-wrapper').show()
                }

            }).error(function(response) {
                $('.warning2').show();
            })

        }
        $scope.isValid = function() {
            var bool = true;
            if ($scope.doctor.id_doctor == undefined) {
                $('.warning').show();
                bool = false;
                $('#iddoctor').css('border-color', 'red');
            } else {
                $('#iddoctor').css('border-color', 'green');
            }
            if ($scope.doctor.nombres == undefined) {
                $('.warning').show();
                bool = false;
                $('#nombre').css('border-color', 'red');
            } else {
                $('#nombre').css('border-color', 'green');
            }
            if ($scope.doctor.apellidos == undefined) {
                $('.warning').show();
                bool = false;
                $('#apellido').css('border-color', 'red');
            } else {
                $('#apellido').css('border-color', 'green');
            }
            if ($scope.doctor.honorarios == undefined) {
                $('.warning').show();
                bool = false;
                $('#honorario').css('border-color', 'red');
            } else {
                $('#honorario').css('border-color', 'green');
            }
            if ($scope.doctor.password == undefined) {
                $('.warning').show();
                bool = false;
                $('#password').css('border-color', 'red');
            } else {
                $('#password').css('border-color', 'green');
            }
            if ($scope.doctor.password2 == undefined) {
                $('.warning').show();
                bool = false;
                $('#confirm-password').css('border-color', 'red');
            } else {
                $('#confirm-password').css('border-color', 'green');
            }
            if ($scope.doctor.password != $scope.doctor.password2) {
                $('.warning').show();
                bool = false;
                $('#confirm-password').css('border-color', 'red');
                $('#password').css('border-color', 'red');
            }
            return bool;
        }
        $scope.doctorRegistry = function() {
                if ($scope.isValid()) {
                    $scope.doctor.id_doctor = 'D' + $scope.doctor.id_doctor;
                    $http.post('/registry', {
                        "id_doctor": $scope.doctor.id_doctor,
                        "nombres": $scope.doctor.nombres,
                        "apellidos": $scope.doctor.apellidos,
                        "honorarios": $scope.doctor.honorarios,
                        "password": $scope.doctor.password
                    }).success(function() {
                        window.location.href = "#/registry/" + $scope.doctor.id_doctor;
                        $('#sidebar-wrapper').show()
                    })
                }

            }
            // $("#wrapper").toggleClass("toggled");
            // if ($('#togglemenu').hasClass('outmenu')) {
            //     $('#togglemenu').removeClass('outmenu');
            // }
            //$('.menu-toggle').hide();
        $('#login-form-link').click(function(e) {
            $("#login-form").delay(500).fadeIn(500);
            $("#register-form").fadeOut(500);
            $('#register-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });
        $('#register-form-link').click(function(e) {
            $("#register-form").delay(500).fadeIn(500);
            $("#login-form").fadeOut(500);
            $('#login-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });
    }])
