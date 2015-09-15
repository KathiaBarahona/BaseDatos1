'use strict';
angular.module('doctorApp', ['ui.router'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('registry', {
                    url: '/registry:doctorID',
                    templateUrl: 'views/registry.view.html',
                    controller: function($scope, $stateParams) {
                        $scope.doctorId = $stateParams.doctorID
                        if ($scope.doctorId == '') {
                            window.location.href = "#/login"
                        }
                    }
                })
                .state('appointments', {
                    url: '/appointments:doctorID',
                    templateUrl: 'views/appointments.view.html',
                    controller: function($scope, $stateParams) {
                        $scope.doctorId = $stateParams.doctorID
                        if ($scope.doctorId == '') {
                            window.location.href = "#/login"
                        }
                    }
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.view.html',
                    controller: function($scope, $stateParams) {
                        $scope.doctors = [{
                            doctorId: '1',
                            password: '123456'
                        }, {
                            doctorId: '2',
                            password: '123456'
                        }]
                        $scope.doctor = {};
                        $scope.login = function() {
                            $.each($scope.doctors, function(index, element) {

                                if (element.doctorId == $scope.doctor.doctorId && element.password == $scope.doctor.password) {

                                    window.location.href = "#/registry:" + element.doctorId;

                                }

                            })

                        }
                        $scope.doctorRegistry = function() {

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

                    }
                })


            $urlRouterProvider.otherwise('login');
        }
    ])
