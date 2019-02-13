<template>
	<div class="app-SearchResults">
		<p v-if="store.searching">Searching...</p>
		<div v-if="store.searchResults.length && !store.searching">
			<p>{{store.searchResults.length}} results for: "{{store.searchParam}}"</p>
			<ul>
				<li v-for="result in store.searchResults" :key="result.id">
					<router-link :to="`/${result.id}`">{{result.name}} ({{result.id}})</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { searchService } from '@/ngVueBridgeCode/ngVueComponentsModule';

export default {
	name: "SearchResults",
	data() {
		return {
			store: searchService.store
		}
	}
};
</script>

<style>
.app-SearchResults {
	padding-top: 1em;
}
.app-SearchResults ul {
	list-style: none;
	padding: 0;
}
.app-SearchResults ul li a {
	text-decoration: none;
}
.app-SearchResults ul li:hover {
	cursor: pointer;
	text-decoration: underline;
	color: blue;
}
</style>