import Vue from 'vue';
import Router from 'vue-router';
import Detail from './components/Detail/index.vue';

Vue.use(Router);

export const router = new Router({
	routes: [
		{
			path: '*',
			redirect: '/'
		},
		{
			path: '/:itemId?',
			name: 'detail',
			component: Detail
		}
	]
});
