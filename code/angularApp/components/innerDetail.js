(function () {
	'use strict';

	angular.module('AngularApp').component('innerDetail', {
		template:
			'<div class="app-InnerDetail">{{$ctrl.title}}: <p>{{$ctrl.innerData}}</p></div>',
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