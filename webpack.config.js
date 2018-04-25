'use strict';
const os = require('os');
const path = require('path');
const webpack = require('webpack');

var cfg = require('./buildconfig.json');
const npm = require('./package.json');
const pug = require('pug');

const WebpackNotifierPlugin = require('webpack-notifier');
const CleanWebpackPlugin  = require('clean-webpack-plugin');
const CopyWebpackPlugin   = require('copy-webpack-plugin');
const HtmlWebpackPlugin   = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

// utils
function chunksSortOrder(chunks) {
    return function(a, b) {
        var i = chunks.indexOf(a.names[0]);
        var j = chunks.indexOf(b.names[0]);
        return i - j;
    }
}

// env variables
const process = require('process');
var argv = require('minimist')(process.argv.slice(2));
if (!argv.mode) argv.mode = 'development';

process.env.WEBPACK = true;
function isDev() { return process.env.NODE_ENV == 'development' }
function isProd() { return process.env.NODE_ENV == 'production' }
function isMac() { return os.platform() == 'darwin' }
function isWin() { return os.platform() == 'win32' }

var flags = {
    watch: false,
    clean: isProd(),
    sourcemaps: isDev() && !isMac(),
    notify: isDev(),
    openBrowser: process.argv.some((v) => ~v.indexOf('webpack-dev-server.js') || ~v.indexOf('--open-browser')),
}

console.log('Builder is running in', argv.mode, 'mode.');

module.exports = {
    mode: argv.mode,
    context: path.resolve(cfg.path.app),
    watch: flags.watch,
    entry: {
        vendor: `app/vendor.js`,
        main: `app/index.js`,
    },
    output: {
        path: path.resolve(__dirname, cfg.path.build),
        // publicPath: '/',
        filename: '[name].js',
        library: '[name]'
    },
    devtool: flags.sourcemaps ? "cheap-source-map" : false,
    devServer: {
        port: cfg.webserver.port,
        host: cfg.webserver.host,
        // hot: true,
        inline: true,
        disableHostCheck: true,
        historyApiFallback: true,
        contentBase: cfg.path.src,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        stats: 'minimal',
    },
    resolve: {
        modules: [
            path.join(__dirname, "src"),
            "node_modules"
        ],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        rules: [
            // { test: /\.js$/, loader: "babel-loader", exclude: [/node_modules/, /bower_components/], query: { presets: ['es2015', 'stage-2'] } },
            { test: /\.(pug|jade)$/, loader: "pug-loader" },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            { test: /\.styl$/, use: ["style-loader", "css-loader", "stylus-loader"] },
            { test: /\.font\.(js|json)$/, use: ["style-loader", "css-loader", "fontgen-loader"] },
            {
                test: /\.(jpeg|jpg|png|gif|woff2?|svg|ttf|eot|fnt)$/i,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]"
                }
            },
            { test: /\.glsl$/, loader: "webpack-glsl-loader" }
        ],
        noParse: /\.min\.js$/
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    },
    plugins: [
        flags.notify ? new WebpackNotifierPlugin({excludeWarnings: true}) : new Function(),
        flags.clean ? new CleanWebpackPlugin([cfg.path.build]) : new Function(),
        flags.openBrowser ? new OpenBrowserPlugin({url: `http://${cfg.webserver.hostname}:${cfg.webserver.port}`}) : new Function(),

        new webpack.LoaderOptionsPlugin({
            debug: true
        }),

        // new webpack.HotModuleReplacementPlugin(),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.pug',
            inject: 'head',
            // chunksSortMode: chunksSortOrder(['vendor', 'main']),
        }),

        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),

        new CopyWebpackPlugin([
            { from: 'lib/*' },
            // { from: 'favicon.*' },
            // { from: 'robots.txt' },
        ]),

        new webpack.ProvidePlugin({
           // $: 'jquery',
           // jQuery: 'jquery',
           // 'window.jQuery': 'jquery',
           Popper: ['popper.js', 'default'],
           _: 'lodash',
        })
    ]
}
