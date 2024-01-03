'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const collectEntryPoints = require('./webpack/collectEntryPoints');

const SOURCE_ROOT = path.resolve(__dirname, 'src');

const resolve = {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    plugins: [new TSConfigPathsPlugin({
        configFile: './tsconfig.json'
    })]
};

module.exports = {
    resolve: resolve,
    entry: collectEntryPoints(SOURCE_ROOT, ['component']),
    devtool: 'eval-source-map',
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist', 'site')
    },
   externals: {
       'react': 'React',
       'react-dom': 'ReactDOM',
   },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'esbuild-loader',
                        options: {
                          loader: 'tsx',
                          target: 'es2015',
                          tsconfigRaw: require('./tsconfig.json')
                        }
                      },
                      {
                        loader: 'webpack-import-glob-loader',
                        options: {
                          url: false
                        }
                      }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            modules: {
                                localIdentName: '[local]__[hash:base64:5]',
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins() {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                    },
                    {
                        loader: 'glob-import-loader',
                        options: {
                            resolve: resolve
                        }
                    }
                ]
            }
        ]
    },
   plugins: [
       new CleanWebpackPlugin(),
       new ESLintPlugin({
           extensions: ['js', 'ts', 'tsx']
       }),
       new MiniCssExtractPlugin({
           filename: 'css/[name].bundle.css',
       })
   ],
    stats: {
        assetsSort: 'chunks',
        builtAt: true,
        children: false,
        chunkGroups: true,
        chunkOrigins: true,
        colors: false,
        errors: true,
        errorDetails: true,
        env: true,
        modules: false,
        performance: true,
        providedExports: false,
        source: false,
        warnings: true
    }
};
