<template>
	<div class="vue-app-container">
		<nav>Navigation Container</nav>
		<main>Main Container</main>
		<span>{{someParam}}</span>
	</div>
</template>

<script>
export default {
	name: 'VueAppContainer',
	props: ['someParam']
};
</script>

<style lang="scss">
.vue-app-container {
	margin-top: 2em;
}
</style>