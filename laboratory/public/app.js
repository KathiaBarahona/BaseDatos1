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
                .state('login',{
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
                    if(value == 3){
                        window.location.href = '#/login';
                    }

                }

            }
        }
    })
    .controller('loginCtrl', ['$scope', '$http', '$stateParams', function($scope, $http) {
    }])
     .controller('billCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $scope.userid= $stateParams.userid
        if ($scope.userid== '' || $scope.userid== 'undefined') {
            //window.location.href = "#/login"
        }
    }])
     .controller('labCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $scope.userid= $stateParams.userid
        if ($scope.userid== '' || $scope.userid== 'undefined') {
            //window.location.href = "#/login"
        }
    }])
    
