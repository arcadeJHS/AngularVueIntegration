<template>
	<div class="app-Detail" v-if="currentDetail">
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
import { searchService } from '@/ngVueBridgeCode/ngVueComponentsModule';

export default {
	name: "Detail",
	data() {
		return {
			currentDetail: null
		}
	},
	methods: {
		getDetail (detailId) {
			searchService.selectItem(Number(detailId));
			this.currentDetail = searchService.store.currentDetail;
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