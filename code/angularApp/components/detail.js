(function () {
	'use strict';

	angular.module('AngularApp').component('detail', {
		template:
			'<div class="app-Detail" ng-if="$ctrl.store.currentDetail">' +
			'	<h1>Detail</h1>' +
			'	<dl>' +
			'		<dt>Id:</dt>' +
			'		<dd>{{$ctrl.store.currentDetail.id}}</dd>' +
			'		<dt>Text:</dt>' +
			'		<dd>{{$ctrl.store.currentDetail.name}}</dd>' +
			'		<dt>Other Field:</dt>' +
			'		<dd>{{$ctrl.store.currentDetail.value}}</dd>' +
			'	</dl>' +
			'	<inner-detail inner-data="$ctrl.store.currentDetail.more"></inner-detail>' +
			'</div>',
		controller: ['searchService', function (searchService) {

			angular.extend(this, {
				store: searchService.store
			});

		}]
	});

})();