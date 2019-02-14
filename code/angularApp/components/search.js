(function () {
	'use strict';

	angular.module('AngularApp').component('search', {
		template:
			'<div class="app-Search">' +
			'	<input type="text" placeholder="search" ng-model="$ctrl.searchInput" />' +
			'	<button ng-disabled="!$ctrl.searchInput" ng-click="$ctrl.search($ctrl.searchInput)">Search</button>' +
			'	(results count: {{$ctrl.resultsCount()}})' +
			'</div>',
		controller: ['$scope', 'searchService', 'VuexStore', 'utilities', 'VueAngularEventBus', function ($scope, searchService, VuexStore, utilities, VueAngularEventBus) {
			var render = utilities.safeApply.bind($scope);

			angular.extend(this, {
				searchInput: '',
				search: function (searchParam) {
					searchService.query(searchParam).then(render);
				},
				resultsCount: function () { 
					return VuexStore.getters['resultsCount'];
				},
				$onInit: function () {
					console.log('Component "search" ready');
					VueAngularEventBus.$on('result-added', render);
				},
				$onDestroy() {
					VueAngularEventBus.$off('result-added', render);
				}
			});

		}]
	});

})();