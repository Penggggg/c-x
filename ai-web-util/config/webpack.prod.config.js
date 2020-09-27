const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',

    entry: {
        // test: path.join( __dirname, '../components/test/index.tsx')
        index: path.join( __dirname, '../index.tsx')
    },

    output: {
        path: path.join( __dirname, '../dist/'),
        filename: '[name].js',
        // library: '@cvte/ai-web-util',
        // libraryTarget: 'umd'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
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
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin( ),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('prodution')
            }
        })
    ]
};