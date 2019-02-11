import '@babel/polyfill';

import '@/assets/styles/index.scss';
import angular from 'angular';
import AngularAppWrapper from './angularAppWrapper/index.js';

angular.module('ngVueApp', []);
angular.module('ngVueApp').component('angularAppWrapper', AngularAppWrapper);

const wrapperEl = document.querySelector('#ng-vue-app');
wrapperEl.insertAdjacentHTML('afterbegin', '<angular-app-wrapper></angular-app-wrapper>');

angular.bootstrap(wrapperEl, ['ngVueApp'], { strictDi: true });