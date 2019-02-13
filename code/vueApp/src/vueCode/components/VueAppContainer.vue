<template>
	<div class="app-VueAppContainer">
		<nav>
			<search-results></search-results>
		</nav>
		<main>
			<router-view></router-view>
		</main>
	</div>
</template>

<script>
import SearchResults from './SearchResults/index.vue';

export default {
	name: 'VueAppContainer',
	components: { 
		SearchResults
	}
};
</script>

<style lang="scss">
.app-VueAppContainer {
	nav {
		float: left;
		border-right: 1px solid #ccc;
		width: 12em;
	}
}
</style>