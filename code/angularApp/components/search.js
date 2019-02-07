(function () {
	'use strict';

	angular.module('AngularApp').component('search', {
		template:
			'<div class="app-Search">' +
			'	<input type="text" placeholder="search" ng-model="$ctrl.searchInput" />' +
			'	<button ng-disabled="!$ctrl.searchInput" ng-click="$ctrl.search($ctrl.searchInput)">Search</button>' +
			'</div>',
		controller: ['searchService', function (searchService) {

			angular.extend(this, {
				searchInput: '',
				search: function (searchParam) {
					searchService.query(searchParam);
				},
				$onInit: function () {
					console.log('Component "search" ready');
				}
			});

		}]
	});

})();