export class SearchService {
	/** @ngInject */
	constructor($timeout, VuexStore) {
		this.$timeout = $timeout;
		this.store = {
			searching: false,
			searchParam: '',
			searchResults: []
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

	query (searchParam) {
		this.store.searching = true;
		this.store.searchParam = searchParam;
		this.store.searchResults = [];
		return this.executeQuery(searchParam).then(this.resolveQuery.bind(this));
	}
};
