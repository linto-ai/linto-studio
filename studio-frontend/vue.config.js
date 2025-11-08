module.exports = {
  configureWebpack: {
    devtool: 'eval-source-map',
  },
  chainWebpack: config => {
    config.module
      .rule('js')
      .uses.delete('thread-loader')
  }
}
