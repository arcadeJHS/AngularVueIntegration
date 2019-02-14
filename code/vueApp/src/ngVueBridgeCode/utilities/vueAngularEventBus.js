/* 
 * 	Event bus to share events between Vue e Angular 
 *
 *	= Use in Vue =
 *	import { VueAngularEventBus } from './vueAngularEventBus.js';
 *	VueAngularEventBus.$emit('custom-event-name', params);
 *
 *	= Use in Angular =
 *	You can use it exactly as in Vue (see above) or you can wrap it into an angular factory and take advantage of dependency injection:
 *	import { VueAngularEventBus } from './vueAngularEventBus.js';
 *	ngVueComponentsModule.factory('VueAngularEventBus', [() => VueAngularEventBus]);
 */

import Vue from 'vue';
export const VueAngularEventBus = new Vue();