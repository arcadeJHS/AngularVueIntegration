<template>
	<div class="app-Detail" v-if="currentDetail">
		<button @click="addResult">Add result</button>
		<h1>Detail</h1>
		<dl>
			<dt>Id:</dt>
			<dd>{{currentDetail.id}}</dd>
			<dt>Text:</dt>
			<dd>{{currentDetail.name}}</dd>
			<dt>Other Field:</dt>
			<dd>{{currentDetail.value}}</dd>
		</dl>
	</div>
</template>

<script>
export default {
	name: "Detail",
	computed: {
    	currentDetail () {
      		return this.$store.getters['currentDetail'];
    	}
  	},
	methods: {
		getDetail (detailId) {
			this.$store.dispatch('selectItem', Number(detailId));
		},
		addResult () {
			this.$store.dispatch('addResult', { 
				id: 4, 
				name: 'Result Four', 
				value: `I'm fuzzy on the whole good/bad thing. What do you mean, "bad"?`, 
				more: "Try to image all life as you know it stopping instantaneously and every molecule in your body exploding at the speed of light." 
			});
		}
	},
	beforeRouteEnter (to, from, next) {
		next(component => component.getDetail(to.params.itemId));
	},
	beforeRouteUpdate (to, from, next) {
		this.getDetail(to.params.itemId);
		next();
	}
};
</script>

<style>
.app-Detail {
	padding: 1em 1em 1em 14em;
}
.app-Detail dl dt {
	float: left;
	width: 100px;
}
</style>