export class SearchService {
	/** @ngInject */
	constructor($timeout, VuexStore) {
		this.$timeout = $timeout;
		this.store = {
			searching: false,
			searchParam: '',
			searchResults: [],
			currentDetail: null
		};
		this.VuexStore = VuexStore;
	}

	executeQuery(searchParam) {
		return this.VuexStore.dispatch('getResults', searchParam);
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
