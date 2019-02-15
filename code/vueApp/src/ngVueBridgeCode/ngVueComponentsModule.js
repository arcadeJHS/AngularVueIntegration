import angular from 'angular';
import Vue from 'vue';
import 'ngVue';
import 'ngVue/build/plugins.js';
import VueAppContainer from '@/vueCode/components/VueAppContainer';
import { SearchService } from '@/ngVueBridgeCode/services/searchService';
import { Utilities } from '@/ngVueBridgeCode/services/utilities';
import { router } from '@/vueCode/router';
import store from '@/vueCode/store';
import { VueAngularEventBus } from '@/ngVueBridgeCode/utilities/VueAngularEventBus.js';
import Search from '@/ngVueBridgeCode/components/Search/index.js';


const ngVueComponentsModule = angular.module('ngVueComponents', ['ngVue', 'ngVue.plugins']);


// directives and components
ngVueComponentsModule.directive('vueAppContainer',
	/** @ngInject */
	createVueComponent => createVueComponent(Vue.component('vueAppContainer', VueAppContainer))
);
ngVueComponentsModule.component('search', Search);


// global vue plugins
ngVueComponentsModule.config(($ngVueProvider) => {
	$ngVueProvider.setRootVueInstanceProps({ router: router });
	$ngVueProvider.setRootVueInstanceProps({ store: store });
});



// services
ngVueComponentsModule.service('searchService', SearchService);
ngVueComponentsModule.service('utilities', Utilities);
export let searchService;
ngVueComponentsModule.run($injector => {
	searchService = $injector.get('searchService');
});



// enable access to Vuex from angular code
ngVueComponentsModule.factory('VuexStore', [() => store]);



// create an angular factory for vue-angular communication event bus
ngVueComponentsModule.factory('VueAngularEventBus', [() => VueAngularEventBus]);


export default ngVueComponentsModule;