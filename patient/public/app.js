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
                    controller: function($scope, $stateParams) {
                        $scope.patientid = $stateParams.patientID
                        if ($scope.patientid == '') {
                            //  window.location.href = "#/login"
                        }

                    }
                })
                .state('history', {
                    url: '/history/:patientID',
                    templateUrl: 'views/history.view.html',
                    controller: function($scope, $stateParams) {
                        $scope.patientid = $stateParams.patientID
                        if ($scope.patientid == '') {}
                        //  window.location.href = "#/login"
                    }
                })
                .state('profile', {
                    url: '/profile/:patientID',
                    templateUrl: 'views/profile.view.html',
                    controller: function($scope, $stateParams) {
                        $scope.patientid = $stateParams.patientID
                        if ($scope.patientid == '') {}
                        // window.location.href = "#/login"
                    }
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.view.html',
                    controller: function($scope, $stateParams) {
                        // $('.navbar-right').hide()
                        

                    }
                })

            $urlRouterProvider.otherwise('login');
        }
    ])
