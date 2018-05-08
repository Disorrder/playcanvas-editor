'use strict';
const os = require('os');
const path = require('path');
const webpack = require('webpack');

var cfg = require('./buildconfig.json');
const pug = require('pug');

const WebpackNotifierPlugin = require('webpack-notifier');
const CleanWebpackPlugin  = require('clean-webpack-plugin');
const CopyWebpackPlugin   = require('copy-webpack-plugin');
const HtmlWebpackPlugin   = require('html-webpack-plugin');

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
function isDev() { return argv.mode == 'development' }
function isProd() { return argv.mode == 'production' }
function isMac() { return os.platform() == 'darwin' }
function isWin() { return os.platform() == 'win32' }

var flags = {
    watch: false,
    clean: isProd(),
    sourcemaps: isDev() && !isMac(),
    notify: isDev(),
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
            { test: /\.(pug|jade)$/, loader: "pug-loader", options: {} },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            { test: /\.styl$/, use: ["style-loader", "css-loader", "stylus-loader"] },
            { test: /\.font\.(js|json)$/, use: ["style-loader", "css-loader", "fontgen-loader"] },
            {
                test: /\.(jpeg|jpg|png|gif|ico|woff2?|svg|ttf|eot|fnt)$/i,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]"
                }
            },
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

        new webpack.LoaderOptionsPlugin({
            debug: true
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.pug',
            inject: 'body',
        }),

        new CopyWebpackPlugin([
            { from: 'config.js' },
            { from: 'favicon.*' },
        ]),
    ]
}

// var fs = require('fs');
// { // check configs
//     ['src/config'].map((v) => {
//         let cfgPath = path.resolve('.', v + '.js');
//         if (!fs.existsSync(cfgPath)) {
//             let defPath = path.resolve('.', v + '.default.js');
//             fs.writeFileSync(cfgPath, fs.readFileSync(defPath));
//         }
//     });
// }
