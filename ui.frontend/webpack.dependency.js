'use strict';

const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const collectEntryPoints = require('./webpack/collectEntryPoints');

const SOURCE_ROOT = path.resolve(__dirname, 'src');

module.exports = merge(common, {
    // A function is used to override the common entry array, preventing the merging of objects.
    entry: () => collectEntryPoints(SOURCE_ROOT, ['dependency']),
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist', 'dependencies'),
    },
    // An array is used to override the common externals object, preventing the merging of objects.
    externals: [],
    mode: 'production',
    optimization: {
        minimize: false
    },
    performance: {hints: false}
});
