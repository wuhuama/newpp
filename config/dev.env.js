'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"tygc"' //开发环境,若调试线上环境,则可替换为 线上具体地址即可
  // BASE_API: ''
})
