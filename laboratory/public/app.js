'use strict';
angular.module('labApp', ['ui.router'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider.state('/', {
                url: '/',
                templateUrl: 'views/laboratory.view.html',
                controller: 'LabCtrl'
            });
        

            $urlRouterProvider.otherwise('/');
        }
    ])
    .controller('LabCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.name = 'Kathia'
    }])
