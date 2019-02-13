export class SearchService {
	/** @ngInject */
	constructor($timeout) {
		this.$timeout = $timeout;
		this.store = {
			searching: false,
			searchParam: '',
			searchResults: [],
			currentDetail: null
		};
	}

	executeQuery (searchParam) {
		return this.$timeout(function () {
			// mock data
			return [
				{ id: 1, name: 'Result One', value: "We're all mad here. I'm mad. You're mad.", more: "What do you hear? Nothin' but the rain, sir. Grab your gun and bring the cat in." },
				{ id: 2, name: 'Result Two', value: 'Are you Alive? Yes. Prove it.', more: "Sometimes I've believed as many as six impossible things before breakfast." },
				{ id: 3, name: 'Result Three', value: 'Do you have any idea why a raven is like a writing desk?', more: "She’s right, Gaius. The end times are approaching. Humanity’s final chapters are about to be written. And you - you will be its author." }
			];
		}, 2000);
	}

	resolveQuery(results) {
		this.store.searchResults = results;
		this.store.searching = false;
	}

	selectItem (id) {
		this.store.currentDetail = this.store.searchResults.find(function (r) {
			return r.id === id;
		});
	}

	query (searchParam) {
		this.store.searching = true;
		this.store.searchParam = searchParam;
		this.store.searchResults = [];
		this.store.currentDetail = null;
		return this.executeQuery(searchParam).then(this.resolveQuery.bind(this));
	}
};
