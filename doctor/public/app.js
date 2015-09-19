'use strict';
angular.module('doctorApp', ['ui.router'])
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

                    }
                }
            }
        }

    )
    .controller('registryCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $scope.doctorId = $stateParams.doctorID
        if ($scope.doctorId == '' || $scope.doctorId == 'undefined') {
            window.location.href = "#/login"
        } else {
            $('#sidebar-wrapper').show();
        }

    }])
    .controller('appointmentsCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $scope.doctorId = $stateParams.doctorID
        if ($scope.doctorId == '' || $scope.doctorId == 'undefined') {
            window.location.href = "#/login"
        } else {
            $('#sidebar-wrapper').show();
        }

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

            }).error(function(response){
                console.log(response)
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
