import '@babel/polyfill';

import angular from 'angular';
import '@/assets/styles/index.scss';

const wrapperEl = document.querySelector('#ng-vue-app');
wrapperEl.insertAdjacentHTML('afterbegin', '<div class="wrapper">Angular App Wrapper</div>');

angular.module('ngVueApp', []);
angular.bootstrap(wrapperEl, ['ngVueApp'], { strictDi: true });