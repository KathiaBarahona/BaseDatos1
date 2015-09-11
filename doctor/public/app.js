'use strict';
angular.module('doctorApp', ['ui.router'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider.state('/', {
                url: '/',
                templateUrl: 'views/doctor.view.html',
                controller: 'DoctorCtrl'
            });
        

            $urlRouterProvider.otherwise('/');
        }
    ])
    .controller('DoctorCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.name = 'Kathia'
    }])
