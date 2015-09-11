'use strict';
angular.module('patientApp', ['ui.router'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider.state('/', {
                url: '/',
                templateUrl: 'views/patient.view.html',
                controller: 'PatientCtrl'
            });
        

            $urlRouterProvider.otherwise('/');
        }
    ])
    .controller('PatientCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.name = 'Kathia'
    }])
