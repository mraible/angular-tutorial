'use strict';

describe('myApp.search module', function() {
    var mockSearchService;

    beforeEach(module('myApp.search', function($provide) {
        mockSearchService = {query: function(term) {}, fetch: function(id) {}};
        $provide.value("SearchService", mockSearchService);
    }));

    describe('search by term', function() {
        var scope, rootScope, controller, deferred;

        // setup the controller with dependencies.
        beforeEach(inject(function($rootScope, $controller, $q) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            controller = $controller('SearchController', {$scope: scope, SearchService: mockSearchService });
            deferred = $q.defer();
        }));

        it('should search when a term is set and search() is called', function() {
            spyOn(mockSearchService, 'query').andReturn(deferred.promise);
            scope.term = 'M';
            scope.search();
            deferred.resolve({data: {name: "Peyton Manning"}});
            rootScope.$apply();
            expect(scope.searchResults).toEqual({name: "Peyton Manning"});
        });
    });

    describe('search by term automatically', function() {
        var scope, rootScope, controller, location, deferred;

        beforeEach(inject(function($rootScope, $controller, $q) {
            rootScope = $rootScope;
            scope = $rootScope.$new();

            // in this case, expectations need to be setup before controller is initialized
            var routeParams = {"term": "peyton"};
            deferred = $q.defer();
            spyOn(mockSearchService, 'query').andReturn(deferred.promise);
            deferred.resolve({data: {name: "Peyton Manning"}});

            controller = $controller('SearchController', {$scope: scope, $routeParams: routeParams, SearchService: mockSearchService });
        }));

        it('should search automatically when a term is on the URL', function() {
            rootScope.$apply();
            expect(scope.searchResults).toEqual({name: "Peyton Manning"});
        });
    });

    describe('edit person', function() {
        var scope, rootScope, controller, location, deferred;

        beforeEach(inject(function($rootScope, $controller, $q) {
            rootScope = $rootScope;
            scope = $rootScope.$new();

            // expectations need to be setup before controller is initialized
            var routeParams = {"id": "1"};
            deferred = $q.defer();
            spyOn(mockSearchService, 'fetch').andReturn(deferred.promise);
            deferred.resolve({data: {name: "Peyton Manning", address: {street: "12345 Blake Street", city: "Denver"}}});

            controller = $controller('EditController', {$scope: scope, $routeParams: routeParams, SearchService: mockSearchService });
        }));

        it('should fetch a single record', function() {
            rootScope.$apply();
            expect(scope.person.name).toBe("Peyton Manning");
            expect(scope.person.address.street).toBe("12345 Blake Street");
        });
    });
});