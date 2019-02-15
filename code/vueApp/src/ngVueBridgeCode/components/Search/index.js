import template from './index.html';
import SafeApply from '@/ngVueBridgeCode/utilities/safeApply';

export default {
	template: template,
	bindings: {
		countLabel: '@'
	},
	controller: class SearchComponentController {
		/** @ngInject */
		constructor($scope, searchService, VuexStore, VueAngularEventBus) {
			this.scope = $scope;
			this.searchService = searchService;
			this.$store = VuexStore;
			this.VueAngularEventBus = VueAngularEventBus;
			this.render = SafeApply.bind(this.scope);
			this.searchInput = '';
		}

		search (searchParam) {
			this.searchService.query(searchParam).then(this.render);
		}

		resultsCount () {
			return this.$store.getters['resultsCount'];
		}

		$onInit() {
			this.VueAngularEventBus.$on('result-added', this.render);
		}

		$onDestroy() {
			this.VueAngularEventBus.$off('result-added', this.render);
		}
	}
};
