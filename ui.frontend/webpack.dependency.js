'use strict';

const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const collectEntryPoints = require('./webpack/collectEntryPoints');

const SOURCE_ROOT = path.resolve(__dirname, 'src');

module.exports = merge(common, {
    entry: () => collectEntryPoints(SOURCE_ROOT, ['dependency']),
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist', 'dependencies'),
    },
    externals: [],
    mode: 'production',
    optimization: {
        minimize: false
    },
    performance: {hints: false}
});
