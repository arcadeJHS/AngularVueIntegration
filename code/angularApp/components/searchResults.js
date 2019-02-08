(function () {
	'use strict';

	angular.module('AngularApp').component('searchResults', {
		template:
			'<div class="app-SearchResults">' +
			'	<p ng-if="$ctrl.store.searching">Searching...</p>' +
			'	<div class="app-SearchResults__list" ng-if="$ctrl.store.searchResults.length">' +
			'		<div ng-if="$ctrl.store.searchParam && !$ctrl.store.searching">' +
			'			<p>{{$ctrl.store.searchResults.length}} results for: "{{$ctrl.store.searchParam}}"</p>' +
			'			<ul ng-if="$ctrl.store.searchResults.length">' +
			'				<li ng-repeat="result in $ctrl.store.searchResults track by result.id" ng-click="$ctrl.select(result.id)">{{result.name}} ({{result.id}})</li>' +
			'			</ul>' +
			'		</div>' +
			'	</div>' +
			'</div>',
		controller: ['searchService', function (searchService) {

			angular.extend(this, {
				store: searchService.store,
				select: function (id) { 
					searchService.selectItem(id);
				}
			});

		}]
	});

})();