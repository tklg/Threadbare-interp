const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var node_env = (process.env.NODE_ENV || 'development').trim();
var is_dev = node_env == 'development';
module.exports = {
    resolve: {
        modules: ["./src/js/", "./node_modules/"]
    },
    entry: {
        app: './src/js/app.jsx'
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/build/js'
    },
    module: {
		loaders: [
		   { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ }
		]
	},
    plugins: is_dev ? [
        new CopyWebpackPlugin([{
            from: 'node_modules/monaco-editor/min/vs',
            to: '../vs',
        }]),
    ] : [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(node_env),
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            mangle: true,
            compress: {
                warnings: false,
            }
        }),
        new CopyWebpackPlugin([{
            from: 'node_modules/monaco-editor/min/vs',
            to: '../vs',
        }]),
    ]
}