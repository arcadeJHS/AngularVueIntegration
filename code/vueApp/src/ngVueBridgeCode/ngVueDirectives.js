import Vue from 'vue';
import ngVueComponentsModule from '@/ngVueBridgeCode/ngVueComponentsModule';
import VueAppContainer from '@/vueCode/components/VueAppContainer';

ngVueComponentsModule.directive('vueAppContainer',
	/** @ngInject */
	createVueComponent => createVueComponent(Vue.component('vueAppContainer', VueAppContainer))
);