import template from './index.html';

export default {
	template: template,
	controller: class AngularAppContainerController {
		/** @ngInject */
		constructor() {
			this.internalString = '';
		}

		$onInit() {
			this.internalString = 'Angular App Container Ready!!!';
		}
	}
};
