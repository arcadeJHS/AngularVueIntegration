(function () {
	'use strict';

	angular.module('AngularApp').component('innerDetail', {
		templateUrl: 'angularApp/components/innerDetail.html',
		bindings: {
			innerData: '<'
		},
		controller: [function () {

			angular.extend(this, {
				title: 'The wise man say'
			});

		}]
	});

})();