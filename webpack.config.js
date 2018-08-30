// webpack v4
const path = require('path');
const context = path.resolve(__dirname);
const CleanPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer-stylus');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
	//context: context,
	entry: {
		all: ['webpack/hot/dev-server', './src/js/index.js', './src/styl/all.styl'],
		pug: './pug.js',
		images: './images.js',
	},
	output: {
		filename: 'js/[name].js',
		path: path.resolve(context, 'dev/'),
		pathinfo: true,
	},
	/*подкл библиотек в entry написать jquery */
	/*resolve: {
		alias: {
			jquery: path.resolve(context, 'node_modules/jquery/src/jquery.js'),
		},
	},*/
	module: {
		rules: [
			// js loader
			{
				test: /\.js$/,
				exclude: [/node_modules/],
				use: {
					loader: 'babel-loader',
				},
			},

			// stylus loader
			{
				test: /\.(styl|stylus)$/,
				exclude: /node_modules/,
				use: [{
						loader: 'file-loader',
						options: {
							name: 'css/[name].css',
						},
					},
					{
						loader: 'extract-loader',
						options: {
							publicPath: '../',
						},
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'stylus-loader',
						options: {
							compress: false,
							use: [autoprefixer({
								browsers: ['> 1%', 'ie > 9', 'iOS > 6'],
								hideWarnings: true
							})],
						},
					},
				],
			},

			// pug loader
			{
				test: /\.(pug|jade)$/,
				exclude: /node_modules/,
				use: [{
						loader: 'file-loader',
						options: {
							name: '[path][name].html',
							context: 'src/pug/',
						},
					},
					{
						loader: 'pug-html-loader',
						options: {
							pretty: true,
						},
					},
				],
			},

			// images loader
			{
				test: /\.(jpg|jpeg|png|svg|ico|gif)$/,
				exclude: /node_modules/,
				use: [{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]',
							context: 'src/',
						},
					},
					{
						loader: 'image-webpack-loader',
						options: {
							svgo: {
								plugins: [{
									removeEmptyAttrs: true
								}],
							},
							optipng: {
								optimizationLevel: 5,
							},
							mozjpeg: {
								quality: 80,
							},
						},
					},
				],
			},
		]
	},
	mode: 'production',
	target: 'web',
	devtool: 'eval',
	watch: true,
		watchOptions: {
			poll: 1000,
			ignored: /node_modules/,
		},

	performance: {
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	},
	plugins: [
		new CleanPlugin(['dev/'], {
			root: context,
			verbose: true,
			dry: false,
		}),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 3000,
			server: {
				baseDir: 'dev',
				directory: true,
			},
			startPath: "/index.html",
		}),
	]
};