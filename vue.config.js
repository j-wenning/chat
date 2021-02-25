module.exports = {
  configureWebpack: config =>
    process.env.NODE_ENV === 'production'
      ? {}
      : {
        devServer: { watchOptions: { aggregateTimeout: 200, poll: 1000 } }
      }
}
