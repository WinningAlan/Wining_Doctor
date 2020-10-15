const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const productionGzipExtensions = ['js', 'css']
const path = require('path')
function resolve(dir) {
 return path.join(__dirname, '.', dir)
}
const publicPath = process.env.NODE_ENV === 'production' ? './Content/Doctor' : './';
module.exports = {
  //entry:'入口文件地址',入口文件，多页面应用程序就有多个入口文件配置
  // output:{
  //   filename:'',
  //   path:'./demo'
  // },//多个文件入口，输出多个，文件名称需要用占位符
  chainWebpack: config => {
    const svgRule = config.module.rule('svg-sprite-loader')
    svgRule.uses.clear()
    svgRule
     .test(/.svg$/)
     .include
     .add(resolve('src/icons')) //处理svg目录
     .end()
     .use('svg-sprite-loader')
     .loader('svg-sprite-loader')
     .options({
      symbolId: 'icon-[name]'
     })
    config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
    
     const svg2Rule = config.module.rule('svg')
     svg2Rule.uses.clear()
     svg2Rule
      .test(/.svg$/)
      .exclude
      .add(resolve('src/icons')) //处理svg目录
      .end()
      .use('svg')
      .loader('file-loader')
      .options({
        name: 'img/[name].[hash:8].[ext]'
      })
   },

  productionSourceMap: false,
  lintOnSave:false,
  // webpack配置对象
  configureWebpack: {
    // Gizp打包
    plugins: [
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),

    ],
    optimization: {
    // 去除consle

    //   minimizer: [
    //     new UglifyJsPlugin({
    //       uglifyOptions: {
    //         compress: {
    //           //warnings: false,
    //           drop_console: true,//console
    //           drop_debugger: false,
    //           pure_funcs: ['console.log']//移除console
    //         }
    //       }
    //   })
    // ],
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
  
  },

  publicPath,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, "./src/assets/styles/variate.less")
      ]
    }
  }
};
