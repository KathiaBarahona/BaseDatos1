'use strict';
angular.module('patientApp', ['ui.router'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('home', {
                    url: '/:patientID',
                    templateUrl: 'views/appointment.view.html',
                    controller: function($scope, $stateParams) {
                        $scope.patientid = $stateParams.patientID
                        console.log($scope.patientid)
                    }
                })
                .state('history', {
                    url: '/history/:patientID',
                    templateUrl: 'views/history.view.html',
                    controller: function($scope, $stateParams) {
                        $scope.patientid = $stateParams.patientID
                    }
                })
                .state('profile', {
                    url: '/profile/:patientID',
                    templateUrl: 'views/profile.view.html',
                    controller: function($scope, $stateParams) {
                        $scope.patientid = $stateParams.patientID
                    }
                })

            $urlRouterProvider.otherwise('home');
        }
    ])
