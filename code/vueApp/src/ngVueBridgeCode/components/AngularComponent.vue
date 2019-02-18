<template>
	<div></div>
</template>

<script>
import angular from 'angular';
import SafeApply from '@/ngVueBridgeCode/utilities/safeApply';

let ctrlUnwatch;

export default {
	name: "AngularComponent",
	props: ['component'],
	mounted () {
		const el = angular.element(this.$el);
		let scope;

		el.injector().invoke(['$compile', '$rootScope', ($compile, $rootScope) => {
			scope = angular.extend($rootScope.$new(), { $ctrl: this.component.$ctrl });
			el.replaceWith($compile(this.component.template)(scope));
		}]);

		ctrlUnwatch = this.$watch('component.$ctrl', (ctrl) => {
			SafeApply.call(scope, () => { scope.$ctrl = angular.merge(scope.$ctrl, ctrl); });
		}, { deep: true });
	},
	destroyed () {
		ctrlUnwatch();
	}
};
</script>
