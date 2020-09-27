const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const packageName = require('../package.json').name;

module.exports = {
    mode: "production",

    entry: {
        index: [
            path.join( __dirname, '../app/web/index.tsx')
        ]
    },

    output: {
        path: path.join( __dirname, '../dist/build'),
        filename: '[name].[chunkhash:8].js',
        publicPath: '/dist/build',
        library: `${packageName}`,
        libraryTarget: 'umd',
        jsonpFunction: `webpackJsonp_${packageName}`,
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        alias: {
            antd: path.resolve('../node_modules/antd'),
            react: path.resolve('../node_modules/react')
        }
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: { allowTsInNodeModules: true }
                    }
                ]
            }, {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }, {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    }, {
                        loader: 'css-loader'
                    }, {
                        loader: 'less-loader'
                    }
                ]
            }, {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    }, {
                        loader: 'css-loader'
                    }
                ]
            }, {
                test: /\.(png|jpg|jpeg|gif)$/,
                use:[
                    {
                        loader: 'url-loader',
                        options:{
                            limit: 0,
                            outputPath: '/img',
                            name: '[name].[ext]',
                            publicPath: '/dist/build/img'
                        }
                    }
                ]
            }
        ]
    },

    optimization: {

        splitChunks: {
    
            cacheGroups: {
        
                commons: {
        
                chunks: 'initial',
        
                minChunks: 2, 
                
                maxInitialRequests: 5,
        
                minSize: 0
        
                },
        
                vendor: {
        
                test: /node_modules/,
        
                chunks: 'initial',
        
                name: 'vendor',
        
                priority: 10,
        
                enforce: true
        
                }
        
            }
    
        }
    },

    plugins: [
        new CleanWebpackPlugin( ),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            title: 'NLP技能',
            inject: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('prodution')
            }
        })
    ]
};