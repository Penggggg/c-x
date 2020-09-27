const path = require('path');
const webpack = require('webpack');
const yargs = require('yargs');
const uglify = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = ( ) => {
  console.log('~~~~~~~~~', process.env.NODE_ENV);
  return {

    // 输出配置
    output: {
        // 输出路径
        path: path.join(__dirname, `../public/dist/`),
        publicPath: `/public/dist/`,
        filename: process.env.NODE_ENV === 'production' ?
                    '[name].[chunkHash:8].js' :
                    '[name].js',
        chunkFilename: process.env.NODE_ENV === 'production' ?
                        'chunk-[id].[chunkhash].js' :
                        'chunk-[id].js'
    },
    resolve: {
      extensions: ['.js', '.vue', '.scss', '.css'], //后缀名自动补全
      alias: {
          'Vue': 'vue/dist/vue.js',
          'vue': 'vue/dist/vue.js',
          'vue-router': 'vue-router/dist/vue-router.common.js'
      }
    },
    module: {
  
      rules: [
          // 使用vue-loader 加载 .vue 结尾的文件
          {
            test: /\.ts$/,
            use: [
              {
                loader: 'ts-loader',
                options: { appendTsSuffixTo: [/\.vue$/]}
              }
            ],
            exclude: /node_modules/
          },
          {
              test: /\.vue$/,
              loader: 'vue-loader'
          },
          {
            test: /\.less$/,
            use: ["vue-style-loader", "css-loader", "less-loader"]
          },
          {
            test: /\.css$/,
            use: ["vue-style-loader", "css-loader", "less-loader"]
          },
          {
            test: /\.(png|jpg|gif|svg)$/,
            use: ['file-loader']
           }
        ]
  
    },
    plugins: [
      // new uglify( ),
      new VueLoaderPlugin( ),
      new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify( process.env.NODE_ENV )
        }
      }),
      // new BundleAnalyzerPlugin()
    ]
  
  };

}
