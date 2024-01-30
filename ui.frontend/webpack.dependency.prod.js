'use strict';

const { merge } = require('webpack-merge');
const dependency = require('./webpack.dependency.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(dependency, {
    devtool: false,
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
        ]
    },
});
