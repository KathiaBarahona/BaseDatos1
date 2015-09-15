'use strict';
angular.module('patientApp', ['ui.router'])


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
    .controller('appointmentCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $('#sandbox-container input').datepicker({
            format: "yyyy/mm/dd"
        });
        $scope.patientid = $stateParams.patientID
        if ($scope.patientid == '' || $scope.patientid == 'undefined') {
            window.location.href = "#/login"
        }
    }])
    .controller('historyCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $scope.patientid = $stateParams.patientID
        if ($scope.patientid == '' || $scope.patientid == 'undefined') {
            window.location.href = "#/login"
        }
    }])
    .controller('profileCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $scope.patientid = $stateParams.patientID
        if ($scope.patientid == '' || $scope.patientid == 'undefined') {
            window.location.href = "#/login"
        }
    }])
    .controller('loginCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {

    }])
