import Vue from 'vue';
import Vuex from 'vuex';
import { VueAngularEventBus } from '@/ngVueBridgeCode/utilities/VueAngularEventBus.js';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		results: []
	},

	actions: {
		getResults: (store, searchParam) => {
			return new Promise((resolve, reject) => {
				let results = [
					{ id: 1, name: 'Result One', value: "We're all mad here. I'm mad. You're mad.", more: "What do you hear? Nothin' but the rain, sir. Grab your gun and bring the cat in." },
					{ id: 2, name: 'Result Two', value: 'Are you Alive? Yes. Prove it.', more: "Sometimes I've believed as many as six impossible things before breakfast." },
					{ id: 3, name: 'Result Three', value: 'Do you have any idea why a raven is like a writing desk?', more: "She’s right, Gaius. The end times are approaching. Humanity’s final chapters are about to be written. And you - you will be its author." }
				];

				setTimeout(() => {
					store.commit('setResults', results);
					resolve(results);
				}, 2000);
			});
		},
		addResult: (store, result) => { 
			store.commit('addResult', result);
		}
	},

	mutations: {
		setResults: (state, results) => {
			state.results = results;
		},
		addResult: (state, result) => {
			state.results = state.results.concat(result);
			VueAngularEventBus.$emit('result-added');
		}
	},

	getters: {
		resultsCount: state => state.results.length
	}
});
