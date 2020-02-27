const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    // the entry file for the bundle
    entry: path.join(__dirname, '/client/src/index.js'),

    // the bundle file we will get in the result
    output: {
        path: path.join(__dirname, '/client/dist/js'),
        filename: 'app.js',
        publicPath: '/'
    },
    node: {
        fs: "empty"
    },
    module: {

        // apply loaders to files that meet given conditions
        loaders: [{
            test: /\.jsx?$/,
            include: path.join(__dirname, '/client/src'),
            loader: 'babel-loader',
            query: {
                presets: ["react", "es2015"]
            }
        },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.less$/,
                loader: 'less-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader'
            },
            {
                test: /\.(jpg|png|gif|svg|pdf|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name]-[hash:8].[ext]'
                        },
                    },
                ]
            }

        ],
    },
    devServer: {
        contentBase: path.join(__dirname, "public"),
        watchContentBase: true,
        publicPath: "/",
        historyApiFallback: true
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            },
            output: {
                comments: false
            }
        }),
        new HtmlWebpackPlugin({
            template: './client/static/index.html',
            minify: {
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true
            }
        }),
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        }),
        new PreloadWebpackPlugin({
            rel: 'preload',
            as: 'script',
            include: 'allChunks',
            fileBlacklist: [/\.(css|map)$/, /base?.+/]
        }),
        new webpack.HashedModuleIdsPlugin(),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CompressionPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ],
    // start Webpack in a watch mode, so Webpack will rebuild the bundle on changes
    watch: true
};