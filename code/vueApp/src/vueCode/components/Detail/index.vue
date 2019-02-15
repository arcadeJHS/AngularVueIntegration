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
		<angular-component :component="innerDetail"></angular-component>
	</div>
</template>

<script>
import { searchService } from '@/ngVueBridgeCode/ngVueComponentsModule';
import AngularComponent from '@/ngVueBridgeCode/components/AngularComponent.vue';

export default {
	name: "Detail",
	components: { 
		AngularComponent
	},
	data () {
		return {
			currentDetail: null
		}
	},
	computed: {
		innerDetail () {
			return {
				template: '<inner-detail inner-data="$ctrl.innerData"></inner-detail>',
				$ctrl: { innerData: this.currentDetail.more }
			};
		}
	},
	methods: {
		getDetail (detailId) {
			searchService.selectItem(Number(detailId));
			this.currentDetail = searchService.store.currentDetail;
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
		next(component => {
			component.getDetail(to.params.itemId);
		});
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