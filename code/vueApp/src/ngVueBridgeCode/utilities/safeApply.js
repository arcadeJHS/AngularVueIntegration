export default function (fn) {
	var phase = this.$root.$$phase;
	if (phase == '$apply' || phase == '$digest') {
		if (fn && (typeof (fn) === 'function')) {
			fn();
		}
	} else {
		this.$apply(fn);
	}
};