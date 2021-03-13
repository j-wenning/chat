require('dotenv/config')
const { resolve } = require('path')
const { PORT } = process.env
module.exports = {
    configureWebpack: {
      resolve: {
        alias: {
          '#': resolve('shared'),
          '~': __dirname,
        }
      },
      devServer: {
        proxy: {
          '^/api': {
            target: 'http://localhost:' + PORT,
            pathRewrite: { '^/api': '' },
            secure: false
          }
        },
        watchOptions: { aggregateTimeout: 200, poll: 1000 }
      }
    }
  }
