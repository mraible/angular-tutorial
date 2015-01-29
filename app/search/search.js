angular.module('myApp.search', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/search', {
                templateUrl: 'search/index.html',
                controller: 'SearchController'
            })
    }])

    .controller('SearchController', function ($scope, SearchService) {
        $scope.search = function () {
            console.log("Search term is: " + $scope.term);
            SearchService.query($scope.term).then(function (response) {
                $scope.searchResults = response.data;
            });
        };
    })

    .factory('SearchService', function ($http) {
        var service = {
            query: function (term) {
                return $http.get('/search/' + term);
            }
        };
        return service;
    });