const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const env = process.env.NODE_ENV;


// APP CONFIG
const mode = env; // ('production': UGLIFY; 'development': NOT UGLIFY)
const minify = (env === 'production');
const sourceMap = (env === 'development');
const buildAsALibrary = (env === 'production');

const settings = {
	paths: {
		source: './src',
		build: 'dist',
		public: '/',
		img: './img',
		js: './js',
		css: './css',
		fonts: {
			file: './css/fonts',
			css: '../'
		}
	},
	entryFile: buildAsALibrary ? 'index.js' : 'DEV/dev.index.js'
};

// WEBPACK CONFIG
const config = {
	mode: mode,
	resolve: {
		extensions: ['*', '.js', '.vue', '.json'],
		alias: {
			'@': path.join(__dirname, settings.paths.source),
			'vue$': 'vue/dist/vue.esm.js'
		}
	},
	entry: {
		appVueLib: path.join(__dirname, settings.paths.source, settings.entryFile)
	},
	output: {
		path: path.join(__dirname, settings.paths.build),
		publicPath: settings.paths.public,
		filename: path.join(settings.paths.js, '[name].js')
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'appVueLib_VendorsDependencies'
				},
				ngVueBridge: {
					test: /[\\/]src\/ngVueBridgeCode[\\/]/,
					name: 'appVueLib_NgVueBridge'
				},
			}
		}
	},
	devtool: sourceMap ? 'source-map' : false,
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.(html|jsp)$/,
				use: [
					{
						loader: "html-loader",
						options: { minimize: true }
					}
				]
			},
			{
				test: /\.js$/,
				include: [path.join(__dirname, settings.paths.source)],
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.(ttf|eot|woff2?)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: path.join(settings.paths.fonts.file, '[name].[ext]'),
							publicPath: settings.paths.fonts.css
						}
					}
				]
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					'vue-style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 2,
							sourceMap: sourceMap
						}
					},
					{
						loader: 'resolve-url-loader'
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: sourceMap,
							sourceMapContents: false
						}
					}
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg|webp)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: path.join(settings.paths.img, '[name].[ext]')
						}
					}
				]
			}
		]
	},
	plugins: [
		new webpack.HashedModuleIdsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new VueLoaderPlugin()
	]
};

// extract CSS
if (env === 'production') {
	config.plugins.push(new MiniCssExtractPlugin({
		filename: path.join(settings.paths.css, '[name].css'),
		chunkFilename: path.join(settings.paths.css, '[name].css'),
		sourceMap: sourceMap
	}));
	// Replace the `vue-style-loader` with the MiniCssExtractPlugin loader.
	const sassLoader = config.module.rules.find(({ test }) => new RegExp(test).test('.scss'));
	sassLoader.use[0] = MiniCssExtractPlugin.loader;
}

// clean dist folder
if (env === 'production') {
	config.plugins.push(new CleanWebpackPlugin([settings.paths.build], {
		root: __dirname,
		verbose: true,
		dry: false
	}));
}

// optimize CSS
if (minify === true) {
	config.optimization.minimizer = [
		new TerserPlugin({
			cache: true,
			parallel: true,
			sourceMap: sourceMap
		}),
		new OptimizeCSSAssetsPlugin({
			cssProcessorOptions: {
				map: sourceMap ? { inline: false, annotation: true } : false,
				safe: true,
				discardComments: { removeAll: true }
			}
		})
	];
}

// do you wanna inject the app into an index.html file?
if (buildAsALibrary === false) {
	config.plugins.push(new HtmlWebpackPlugin({
		template: path.join(__dirname, settings.paths.source, 'index.html'),
		filename: path.join(__dirname, settings.paths.build, 'index.html'),
		inject: true,
		minify: minify ? {
			// Options: https://github.com/kangax/html-minifier#options-quick-reference
			removeComments: true,
			collapseWhitespace: true,
			removeAttributeQuotes: true
		} : false
	}));
}

/*
	Production build only: avoid duplicate angular library warning (angular is already loaded into the old app).
	https://stackoverflow.com/questions/52858367/gradually-move-from-including-each-js-files-to-module-bundling
	https://webpack.js.org/configuration/externals/
*/
if (env === 'production') {
	config.externals = {
		angular: 'angular'
	};
}

module.exports = config;