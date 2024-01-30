const {merge} = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const SOURCE_ROOT = __dirname + '/src/main/webpack';

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: ['default', {
                        calc: true,
                        convertValues: true,
                        discardComments: {
                            removeAll: true
                        },
                        discardDuplicates: true,
                        discardEmpty: true,
                        mergeRules: true,
                        normalizeCharset: true,
                        reduceInitial: true, // This is since IE11 does not support the value Initial
                        svgo: true
                    }],
                }
            }),
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, SOURCE_ROOT + '/assets/common'), to: './resources/common' }
            ]
        })
    ],
    devtool: false,
    performance: {hints: false}
});
