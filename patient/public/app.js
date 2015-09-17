'use strict';
angular.module('patientApp', ['ui-notification', 'ui.router'])

.config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 1000,
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
                .state('home', {
                    url: '/home/:patientID',
                    templateUrl: 'views/appointment.view.html',
                    controller: 'appointmentCtrl'
                })
                .state('history', {
                    url: '/history/:patientID',
                    templateUrl: 'views/history.view.html',
                    controller: 'historyCtrl'
                })
                .state('profile', {
                    url: '/profile/:patientID',
                    templateUrl: 'views/profile.view.html',
                    controller: 'profileCtrl'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.view.html',
                    controller: 'loginCtrl'
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
                            var url = "#/home/" + $stateParams.patientID
                            window.location.href = url;
                        }
                        if (value == 1) {
                            var url = "#/history/" + $stateParams.patientID
                            window.location.href = url;
                        }
                        if (value == 2) {
                            var url = "#/profile/" + $stateParams.patientID
                            window.location.href = url;
                        }

                    }
                }
            }
        }

    )
    .controller('appointmentCtrl', ['$scope', '$http', '$stateParams', 'Notification', function($scope, $http, $stateParams, Notification) {
        $('#sandbox-container input').datepicker({
            format: "yyyy/mm/dd"
        });
        $scope.patientid = $stateParams.patientID

        if ($scope.patientid == '' || $scope.patientid == 'undefined') {
            window.location.href = "#/login"
        } else {
            $('.navbar-right').show()
        }
        $http.get('doctores').success(function(response) {
            $.each(response, function(i, item) {
                $('#seldoctores').append($('<option>', {
                    value: item.id_doctor,
                    text: item.nombres + ' ' + item.apellidos
                }));
            });
        })
        $scope.cita = {};
        $scope.reservarCita = function() {

            $http.post('/appointment', {
                "id_doctor": $scope.cita.id_doctor,
                "id_paciente": $scope.patientid,
                "fecha": $scope.cita.fecha,
                "motivo": $scope.cita.motivo
            }).success(function() {
                Notification.success('La cita fue reservada exitosamente');
            });
        };

    }])
    .controller('historyCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $scope.patientid = $stateParams.patientID
        if ($scope.patientid === '' || $scope.patientid === 'undefined') {
            window.location.href = "#/login"
        } else {
            $('.navbar-right').show();
        }
        $scope.registries;
        $http.post('/historial', {
            "id_paciente": $scope.patientid
        }).success(function(response) {
            $scope.registries = response;
        });
        $scope.verFacturas = function(value) {
            $http.post('/cuenta', {
                "id_registro": value
            }).success(function(response) {
                console.log(response)
            });
        }
        $scope.verExamenes = function(value) {
            $http.post('/examenes', {
                "id_registro": value
            }).success(function(response) {
                console.log(response)
            });
        }
        $scope.verEnfermedades = function(value) {
            $http.post('/enfermedades', {
                "id_registro": value
            }).success(function(response) {
                console.log(response)
            });
        }
        $scope.verMedicamentos = function(value) {
            $http.post('/medicamentos', {
                "id_registro": value
            }).success(function(response) {
                console.log(response)
            });
        }
        $scope.verSintomas = function(value) {
            $http.post('/sintomas', {
                "id_registro": value
            }).success(function(response) {
                console.log(response)
            });
        }

    }])
    .controller('profileCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $scope.patientid = $stateParams.patientID
        if ($scope.patientid == '' || $scope.patientid == 'undefined') {
            window.location.href = "#/login"
        } else {
            $('.navbar-right').show();
        }

    }])
    .controller('loginCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $('.navbar-right').hide()
        $('#sandbox-container input').datepicker({
            format: "yyyy/mm/dd"
        });
        $scope.patient;
        $scope.login = function() {
            $scope.patient.id_paciente = 'P' + $scope.patient.id_paciente;
            $http.post('/login', {
                "id_paciente": $scope.patient.id_paciente,
                "password": $scope.patient.password
            }).success(function(response) {
                if (response == 'existe') {
                    window.location.href = "#/home/" + $scope.patient.id_paciente;
                    $('.navbar-right').show();
                } else {
                    $('warning2').show();
                }

            });
        }
        $scope.valid = function() {
            var bool = true;

            if ($scope.patient.tipo_sangre === undefined) {
                $('.warning').show();
                bool = false;
                $('.bloodpatient').css('border-color', 'red');
            } else {
                $('.bloodpatient').css('border-color', 'green');
            }
            if ($scope.patient.sexo === undefined) {
                $('.warning').show();
                bool = false;
                $('.sexpatient').css('border-color', 'red');
            } else {
                $('.sexpatient').css('border-color', 'green');
            }
            if ($scope.patient.password2 === undefined) {
                $('.warning').show();
                bool = false;
                $('.password2patient').css('border-color', 'red');
            } else {
                $('.password2patient').css('border-color', 'green');
            }
            if ($scope.patient.password === undefined) {
                $('.warning').show();
                bool = false;
                $('.passwordpatient').css('border-color', 'red');
            } else {
                $('.passwordpatient').css('border-color', 'green');
            }
            if ($scope.patient.password != $scope.patient.password2) {
                $('.warning').show();
                bool = false;
                $('.password2patient').css('border-color', 'red');
                $('.passwordpatient').css('border-color', 'red');
            }
            if ($scope.patient.ocupacion === undefined) {
                $('.warning').show();
                bool = false;
                $('.jobpatient').css('border-color', 'red');
            } else {
                $('.jobpatient').css('border-color', 'green');
            }
            if ($scope.patient.fecha_nac === undefined) {
                $('.warning').show();
                bool = false;
                $('.datepatient').css('border-color', 'red');
            } else {
                $('.datepatient').css('border-color', 'green');
            }
            if ($scope.patient.id_paciente === undefined) {
                $('.warning').show();
                bool = false;
                $('.idpatient').css('border-color', 'red');
            } else {
                $('.idpatient').css('border-color', 'green');
            }
            if ($scope.patient.apellidos === undefined) {
                $('.warning').show();
                bool = false;
                $('.lastnamepatient').css('border-color', 'red');
            } else {
                $('.lastnamepatient').css('border-color', 'green');
            }
            if ($scope.patient.nombres === undefined) {
                $('.warning').show();
                bool = false;
                $('.namepatient').css('border-color', 'red');
            } else {
                $('.namepatient').css('border-color', 'green');
            }
            if ($scope.patient.direccion === undefined) {
                $('.warning').show();
                bool = false;
                $('.adresspatient').css('border-color', 'red');
            } else {
                $('.adresspatient').css('border-color', 'green');
            }
            if ($scope.patient.email === undefined) {
                $('.warning').show();
                bool = false;
                $('.emailpatient').css('border-color', 'red');
            } else {
                $('.emailpatient').css('border-color', 'green');
            }
            if ($scope.patient.contact_emer === undefined) {
                $('.warning').show();
                bool = false;
                $('.contactpatient').css('border-color', 'red');
            } else {
                $('.contactpatient').css('border-color', 'green');
            }
            if ($scope.patient.estado_marital === undefined) {
                $('.warning').show();
                bool = false;
                $('.statepatient').css('border-color', 'red');
            } else {
                $('.statepatient').css('border-color', 'green');
            }
            return bool;
        };

        $scope.registry = function() {
            if ($scope.valid()) {
                Date.prototype.yyyymmdd = function() {
                    var yyyy = this.getFullYear().toString();
                    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
                    var dd = this.getDate().toString();
                    return yyyy + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]); // padding
                };

                var d = new Date();
                $scope.patient.fecha_registro = d.yyyymmdd();
                $scope.patient.id_paciente = 'P' + $scope.patient.id_paciente;
                $http.post('/registry', {
                    "id_paciente": $scope.patient.id_paciente,
                    "nombres": $scope.patient.nombres,
                    "apellidos": $scope.patient.apellidos,
                    "contact_emer": $scope.patient.contact_emer,
                    "ocupacion": $scope.patient.ocupacion,
                    "email": $scope.patient.email,
                    "fecha_nac": $scope.patient.fecha_nac,
                    "estado_marital": $scope.patient.estado_marital,
                    "sexo": $scope.patient.sexo,
                    "tipo_sangre": $scope.patient.tipo_sangre,
                    "direccion": $scope.patient.direccion,
                    "fecha_registro": $scope.patient.fecha_registro,
                    "password": $scope.patient.password
                }).success(function(response) {
                    window.location.href = "#/home/" + $scope.patient.id_paciente;
                    $('.navbar-right').show();
                });
            }

        };
    }]);
