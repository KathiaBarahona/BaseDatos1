'use strict';
angular.module('doctorApp', ['ui.router'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider.state('registry', {
                url: '/:doctorID',
                templateUrl: 'views/registry.view.html',
                controller: function($scope,$stateParams){
                    $scope.doctorId = $stateParams.doctorID
                }
            });
        

            $urlRouterProvider.otherwise('/');
        }
    ])
    .controller('DoctorCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.name = 'Kathia'
    }])
