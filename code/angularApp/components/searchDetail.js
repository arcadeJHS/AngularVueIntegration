(function () {
	'use strict';

	angular.module('AngularApp').component('searchDetail', {
		template:
			'<div class="app-SearchDetail" ng-if="$ctrl.store.currentDetail">' +
			'	<h1>{{$ctrl.sectionTitle}}</h1>' +
			'	<dl>' +
			'		<dt>Id:</dt>' +
			'		<dd>{{$ctrl.store.currentDetail.id}}</dd>' +
			'		<dt>Text:</dt>' +
			'		<dd>{{$ctrl.store.currentDetail.text}}</dd>' +
			'		<dt>Other Field:</dt>' +
			'		<dd>{{$ctrl.store.currentDetail.field}}</dd>' +
			'	</dl>' +
			'</div>',
		bindings: {
			sectionTitle: '@'
		},
		controller: ['searchService', function (searchService) {

			angular.extend(this, {
				store: searchService.store
			});

		}]
	});

})();