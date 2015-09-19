'use strict';
angular.module('labApp', ['ui-notification', 'ui.router'])

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
                .state('bill', {
                    url: '/bill/:userid',
                    templateUrl: 'views/bill.view.html',
                    controller: 'billCtrl'
                })
                .state('newExam', {
                    url: '/newexam/:userid',
                    templateUrl: 'views/newExam.view.html',
                    controller: 'labCtrl'
                })
                .state('exam', {
                    url: '/assignExam/:userid',
                    templateUrl: 'views/assignExam.view.html',
                    controller: 'labCtrl'
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
                    console.log(value)
                    if (value == 0) {
                        var url = "#/bill/" + $stateParams.userid;
                        window.location.href = url;
                    }
                    if (value == 1) {
                        var url = "#/newexam/" + $stateParams.userid;
                        window.location.href = url;
                    }
                    if (value == 2) {
                        var url = "#/assignExam/" + $stateParams.userid;
                        window.location.href = url;
                    }
                    if (value == 3) {
                        window.location.href = '#/login';
                    }

                }

            }
        }
    })
    .controller('loginCtrl', ['$scope', '$http', '$stateParams', function($scope, $http) {
        $scope.user;
        $scope.login = function() {
            $scope.user.id_usuario = 'U' + $scope.user.id_usuario;
            $http.post('/login', {
                "id_usuario": $scope.user.id_usuario,
                "password": $scope.user.password
            }).success(function(response) {
                window.location.href = "#/bill/" + $scope.user.id_usuario;

            }).error(function(response) {
                $('.warning2').show();

            })

        }
        $scope.valid = function() {
            var bool = true;
            if ($scope.user.password == undefined) {
                $('.warning').show();
                bool = false;
                $('.pass1').css('border-color', 'red');

            } else {
                $('.pass1').css('border-color', 'green');
            }
            if ($scope.user.password2 == undefined) {
                $('.warning').show();
                bool = false;
                $('.pass2').css('border-color', 'red');

            } else {
                $('.pass2').css('border-color', 'green');
            }
            if ($scope.user.password != $scope.user.password2) {
                $('.warning').show();
                bool = false;
                $('.pass2').css('border-color', 'red');
                $('.pass1').css('border-color', 'red');
            }
            if ($scope.user.id_usuario == undefined) {
                $('.warning').show();
                bool = false;
                $('.userid').css('border-color', 'red');
            } else {
                $('.userid').css('border-color', 'green');
            }
            return bool;

        }
        $scope.registry = function() {
            if ($scope.valid()) {
                $scope.user.id_usuario = 'U' + $scope.user.id_usuario;
                $http.post('/registry', {
                    "id_usuario": $scope.user.id_usuario,
                    "password": $scope.user.password
                }).success(function(response) {
                    window.location.href = "#/bill/" + $scope.user.id_usuario;
                    //$('.navbar-right').show();
                });
            }

        }
    }])
    .controller('billCtrl', ['$scope', '$http', '$stateParams', 'Notification', function($scope, $http, $stateParams, Notification) {
        $scope.userid = $stateParams.userid;
        $scope.exams;
        $scope.bill;
        $scope.total;
        if ($scope.userid == '' || $scope.userid == 'undefined') {
            window.location.href = "#/login"
        } else {
            $('.navbar-nav').show();
        }
        $http.get('/pacientes').success(function(response) {
            $scope.patients = response;
            $.each(response, function(i, item) {
                $('#pacientesel').append($('<option>', {
                    value: item.id_paciente,
                    text: item.nombres + ' ' + item.apellidos
                }))
            });
        })
        $('#pacientesel').change(function() {
            $('#registrosel').empty();
            $http.post('/registros', {
                'id_paciente': $('#pacientesel').val()
            }).success(function(response2) {
                $scope.registries = response2;
                $.each(response2, function(i, item) {
                    $('#registrosel').append($('<option>', {
                        value: item.id_registro,
                        text: item.id_registro
                    }))
                })
                if (response2.id_registro != undefined) {
                    $('#registrosel').val($scope.registries[0].id_registro)
                    if ($scope.registries.length == 1) {
                        console.log($('#registrosel').val())
                        $http.post('/examenes', {
                            'id_registro': $('#registrosel').val()
                        }).success(function(response3) {
                            $scope.exams = response3;
                        })
                    }
                }

            })
        })
        $('#registrosel').change(function() {
            $http.post('/examenes', {
                'id_registro': $('#registrosel').val()
            }).success(function(response) {
                $scope.exams = response;
            })
        });
        $scope.generateBill = function() {
            $http.post('/cuenta', {
                'id_registro': $('#registrosel').val()
            }).success(function(response) {
                $scope.bill = response[0];
                $scope.total = 0;
                $scope.total += $scope.bill.honorarios;
                if ($scope.exams == undefined)
                    $http.post('/examenes', {
                        'id_registro': $('#registrosel').val()
                    }).success(function(response3) {
                        $scope.exams = response3;
                        $.each($scope.exams, function(index, element) {
                            $scope.total += element.costo;
                        });
                    })

            }).error(function(response) {
                Notification.error('Asegurese de llenar todos los campos');
            })
        }

    }])
    .controller('labCtrl', ['$scope', '$http', '$stateParams', 'Notification', function($scope, $http, $stateParams, Notification) {
        $scope.userid = $stateParams.userid
        $scope.exam;
        $scope.exams;
        $scope.patients;
        $scope.registries;
        if ($scope.userid == '' || $scope.userid == 'undefined') {
            window.location.href = "#/login"
        } else {
            $('.navbar-nav').show();
        }
        $scope.addExam = function() {
            $http.post('/examen', {
                'id_examen': $scope.exam.id_examen,
                'tipo': $scope.exam.tipo,
                'costo': $scope.exam.costo
            }).success(function(response) {
                Notification.success('El examen fue agregado exitosamente');

            }).error(function(response) {
                Notification.error('El examen ya existe, o un dato fue ingresado incorrectamente');
            })

        }
        $http.get('/pacientes').success(function(response) {
            $scope.patients = response;
            $.each(response, function(i, item) {
                $('#pacientesel').append($('<option>', {
                    value: item.id_paciente,
                    text: item.nombres + ' ' + item.apellidos
                }))
            });
        })
        $('#pacientesel').change(function() {
            $('#registrosel').empty();
            $http.post('/registros', {
                'id_paciente': $('#pacientesel').val()
            }).success(function(response2) {
                $scope.registries = response2;
                console.log(response2)
                $.each(response2, function(i, item) {
                    $('#registrosel').append($('<option>', {
                        value: item.id_registro,
                        text: item.id_registro
                    }))
                })
            })
        })

        $http.get('/examenes').success(function(response) {
            $scope.exams = response;
            console.log(response)
            $.each(response, function(i, item) {
                $('#typexam').append($('<option>', {
                    value: item.id_examen,
                    text: item.tipo
                }))
            })
        })



        $scope.realizarExamen = function() {
            $http.post('/paciente_examen', {
                'id_paciente': $('#pacientesel').val(),
                'id_registro': $('#registrosel').val(),
                'id_examen': $('#typexam').val()
            }).success(function(response) {
                Notification.success('El examen fue realizado exitosamente');
            }).error(function(response) {
                Notification.error('El examen ya ha sido asignado a ese registro');
            })
        }
    }])
