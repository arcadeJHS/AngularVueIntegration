(function (app) {
	'use strict';

	angular.module('AngularApp').factory('searchService', ['$timeout', function ($timeout) {

		var store = {
			searching: false,
			searchParam: '',
			searchResults: [],
			currentDetail: null
		};

		function executeQuery(searchParam) { 
			return $timeout(function () {
				// mock data
				return [
					{ id: 1, name: 'Result One', value: "We're all mad here. I'm mad. You're mad.", more: "What do you hear? Nothin' but the rain, sir. Grab your gun and bring the cat in." },
					{ id: 2, name: 'Result Two', value: 'Are you Alive? Yes. Prove it.', more: "Sometimes I've believed as many as six impossible things before breakfast." },
					{ id: 3, name: 'Result Three', value: 'Do you have any idea why a raven is like a writing desk?', more: "She’s right, Gaius. The end times are approaching. Humanity’s final chapters are about to be written. And you - you will be its author." }
				];
			}, 2000);
		}

		function resolveQuery(results) { 
			store.searchResults = results;
			store.searching = false;
		}

		function selectItem(id) { 
			store.currentDetail = store.searchResults.find(function (r) {
				return r.id === id;
			});
		}

		return {
			store: store,
			query: function (searchParam) {
				store.searching = true;
				store.searchParam = searchParam;
				store.searchResults = [];
				store.currentDetail = null;
				executeQuery(searchParam).then(resolveQuery);
			},
			selectItem: selectItem
		};

	}]);

})();