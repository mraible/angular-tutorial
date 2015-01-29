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
    });