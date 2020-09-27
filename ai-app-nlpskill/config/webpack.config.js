const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const packageName = require('../package.json').name;

module.exports = {
    mode: "development",

    entry: {
        index: [
            path.join( __dirname, '../app/web/index.tsx')
        ]
    },

    output: {
        path: path.join( __dirname, '../dist'),
        filename: '[name].js',
        publicPath: '/',
        library: `${packageName}`,
        libraryTarget: 'umd',
        jsonpFunction: `webpackJsonp_${packageName}`,
    },

    devtool: "inline-source-map",

    devServer: {
        contentBase: './dist',
        host: '0.0.0.0',
        port: 8088,
        open: true,
        hot: true,
        inline: true,
        historyApiFallback: true,
        hotOnly: true,
        proxy: {
            '/t-apis': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
            '/t-nlp': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        }
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
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
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
                            name: '[name].[ext]',
                            pulbicPath: '/'
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
    
              minChunks: 2, maxInitialRequests: 5,
    
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
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            title: 'CVTE-算法模型训练平台',
            inject: true
        }),
        new webpack.HotModuleReplacementPlugin( ),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        })
    ]
};