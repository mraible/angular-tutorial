'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ngMockE2E',
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.search'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
