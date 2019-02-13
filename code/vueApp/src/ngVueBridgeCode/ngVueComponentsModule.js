import angular from 'angular';
import Vue from 'vue';
import 'ngVue';
import 'ngVue/build/plugins.js';
import VueAppContainer from '@/vueCode/components/VueAppContainer';
import { SearchService } from '@/ngVueBridgeCode/services/searchService';
import { router } from '@/vueCode/router';


const ngVueComponentsModule = angular.module('ngVueComponents', ['ngVue', 'ngVue.plugins']);


// directives
ngVueComponentsModule.directive('vueAppContainer',
	/** @ngInject */
	createVueComponent => createVueComponent(Vue.component('vueAppContainer', VueAppContainer))
);


// global vue plugins
ngVueComponentsModule.config(($ngVueProvider) => {
	$ngVueProvider.setRootVueInstanceProps({ router: router });
});



// services
ngVueComponentsModule.service('searchService', SearchService);
export let searchService;
ngVueComponentsModule.run($injector => {
	searchService = $injector.get('searchService');
});


export default ngVueComponentsModule;