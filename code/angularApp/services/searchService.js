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
					{ id: 1, text: 'Result One', field: 'Field value for result 1' },
					{ id: 2, text: 'Result Two', field: 'Field value for result 2' },
					{ id: 3, text: 'Result Three', field: 'Field value for result 3' }
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