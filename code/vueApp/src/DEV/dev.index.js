import '@babel/polyfill';

import '@/assets/styles/index.scss';
import angular from 'angular';
import ngVueComponentsModule from '@/ngVueBridgeCode/ngVueComponentsModule';
import AngularAppContainer from './angularAppContainer';

angular.module('ngVueApp', [ngVueComponentsModule.name]);
angular.module('ngVueApp').component('angularAppContainer', AngularAppContainer);

const wrapperEl = document.querySelector('#ng-vue-app');
wrapperEl.insertAdjacentHTML('afterbegin', '<angular-app-container></angular-app-container>');

angular.bootstrap(wrapperEl, ['ngVueApp'], { strictDi: true });