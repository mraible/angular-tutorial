// We will be using backend-less development
// $http uses $httpBackend to make its calls to the server
// $resource uses $http, so it uses $httpBackend too
// We will mock $httpBackend, capturing routes and returning data
angular.module('myApp')
    .service('ServerDataModel', function ServerDataModel() {
        this.data = [
            {
                id: 1,
                name: "Peyton Manning",
                phone: "(303) 567-8910",
                address: {
                    street: "1234 Main Street",
                    city: "Greenwood Village",
                    state: "CO",
                    zip: "80111"
                }
            },
            {
                id: 2,
                name: "Demaryius Thomas",
                phone: "(720) 213-9876",
                address: {
                    street: "5555 Marion Street",
                    city: "Denver",
                    state: "CO",
                    zip: "80202"
                }
            },
            {
                id: 3,
                name: "Von Miller",
                phone: "(917) 323-2333",
                address: {
                    street: "14 Mountain Way",
                    city: "Vail",
                    state: "CO",
                    zip: "81657"
                }
            }
        ];

        this.getData = function () {
            return this.data;
        };

        this.search = function (term) {
            if (term == "" || term == "*") {
                return this.getData();
            }
            // find the name that matches the term
            var list = $.grep(this.getData(), function (element, index) {
                term = term.toLowerCase();
                return (element.name.toLowerCase().match(term));
            });

            if (list.length === 0) {
                return [];
            } else {
                return list;
            }
        };

        this.find = function (id) {
            // find the game that matches that id
            var list = $.grep(this.getData(), function (element, index) {
                return (element.id == id);
            });
            if (list.length === 0) {
                return {};
            }
            // even if list contains multiple items, just return first one
            return list[0];
        };

        this.update = function (id, dataItem) {
            // find the game that matches that id
            var people = this.getData();
            var match = null;
            for (var i = 0; i < people.length; i++) {
                if (people[i].id == id) {
                    match = people[i];
                    break;
                }
            }
            if (!angular.isObject(match)) {
                return {};
            }
            angular.extend(match, dataItem);
            return match;
        };
    })
    .run(function ($httpBackend, ServerDataModel) {

        $httpBackend.whenGET(/\/search\/\w+/).respond(function (method, url, data) {
            // parse the matching URL to pull out the term (/search/:term)
            var term = url.split('/')[2];

            var results = ServerDataModel.search(term);

            return [200, results, {Location: '/search/' + term}];
        });

        $httpBackend.whenGET(/search\/index.html/).passThrough();
        $httpBackend.whenGET(/view/).passThrough();

        $httpBackend.whenGET(/\/search/).respond(function (method, url, data) {
            var results = ServerDataModel.search("");

            return [200, results];
        });

        $httpBackend.whenGET(/\/edit\/\d+/).respond(function (method, url, data) {
            // parse the matching URL to pull out the id (/edit/:id)
            var id = url.split('/')[2];

            var results = ServerDataModel.find(id);

            return [200, results, {Location: '/edit/' + id}];
        });

        $httpBackend.whenPOST(/\/edit\/\d+/).respond(function(method, url, data) {
            var params = angular.fromJson(data);

            // parse the matching URL to pull out the id (/edit/:id)
            var id = url.split('/')[2];

            var person = ServerDataModel.update(id, params);

            return [201, person, { Location: '/edit/' + id }];
        });

        $httpBackend.whenGET(/search\/edit.html/).passThrough();
    });