const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
  },
}