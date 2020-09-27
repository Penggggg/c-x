const path = require('path');
const yargs = require('yargs');
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')


module.exports = ( ) => {

  return  merge( baseConfig( ), {

    entry: {
      app: path.join( __dirname, `../app/web/entry-client.js` ),
      vendor: ['vue', 'vue-router', 'axios' ]
    },
    
    plugins: [
      // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
      // 以便可以在之后正确注入异步 chunk。
      // 这也为你的 应用程序/vendor 代码提供了更好的缓存。

      new webpack.optimize.SplitChunksPlugin({
        name: "vendor",
        minChunks: Infinity
      }),

      new webpack.optimize.SplitChunksPlugin({
        name: "manifest",
        minChunks: Infinity
      }),
      // 此插件在输出目录中
      // 生成 `vue-ssr-client-manifest.json`。
      new VueSSRClientPlugin()
    ]
  })
}