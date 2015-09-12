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
                    }
                })
                .state('appointments', {
                    url: '/appointments:doctorID',
                    templateUrl: 'views/appointments.view.html',
                    controller: function($scope, $stateParams) {
                        $scope.doctorId = $stateParams.doctorID
                    }
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.view.html',
                    controller: function($scope, $stateParams) {
                        $("#wrapper").toggleClass("toggled");
                        if ($('#togglemenu').hasClass('outmenu')) {
                            $('#togglemenu').removeClass('outmenu');
                        }
                        $('.menu-toggle').hide();
                        $('#login-form-link').click(function(e) {
                            $("#login-form").delay(100).fadeIn(100);
                            $("#register-form").fadeOut(100);
                            $('#register-form-link').removeClass('active');
                            $(this).addClass('active');
                            e.preventDefault();
                        });
                        $('#register-form-link').click(function(e) {
                            $("#register-form").delay(100).fadeIn(100);
                            $("#login-form").fadeOut(100);
                            $('#login-form-link').removeClass('active');
                            $(this).addClass('active');
                            e.preventDefault();
                        });

                    }
                })


            $urlRouterProvider.otherwise('login');
        }
    ])
