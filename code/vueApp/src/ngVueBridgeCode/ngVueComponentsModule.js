import angular from 'angular';
import 'ngVue';
import 'ngVue/build/plugins.js';

const ngVueComponentsModule = angular.module('ngVueComponents', ['ngVue', 'ngVue.plugins']);

export default ngVueComponentsModule;