'use strict';
angular.module('labApp', ['ui.router'])
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
    .controller('billCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $scope.userid = $stateParams.userid
        if ($scope.userid == '' || $scope.userid == 'undefined') {
            window.location.href = "#/login"
        } else {
            $('.navbar-nav').show();
        }
    }])
    .controller('labCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $scope.userid = $stateParams.userid
        if ($scope.userid == '' || $scope.userid == 'undefined') {
            window.location.href = "#/login"
        } else {
            $('.navbar-nav').show();
        }
    }])
