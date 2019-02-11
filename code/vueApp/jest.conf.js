const path = require('path');

module.exports = {
	rootDir: path.resolve(__dirname, ''),
	moduleFileExtensions: [
		"js",
		"json",
		"vue"
	],
	transform: {
		"^.+\\.js$": "<rootDir>/node_modules/babel-jest",
		".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
	},
	transformIgnorePatterns: [
		"node_modules"
	],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	snapshotSerializers: [
		"<rootDir>/node_modules/jest-serializer-vue"
	],
	collectCoverage: true,
	collectCoverageFrom: [
		"**/src/**/*.{js,vue}"
	],
	coverageReporters: ["text", "text-summary"]
};
