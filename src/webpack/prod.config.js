const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = require('./config')
const prodConfig = {
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: '"production"',
        },
      },
    }),
    new HtmlWebpackPlugin({
      title: 'FullStack Web App',
      template: './src/ui/index.html',
    }),
    new CopyPlugin([
      {
        from: path.join(process.cwd(), '/src/public'),
        to: path.join(process.cwd(), '/dist'),
      },
    ]),
  ],
  output: {
    path: path.join(process.cwd(), '/dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['*', '.mjs', '.js', '.jsx'],
    modules: ['node_modules', 'src'],
    alias: {},
  },
}

module.exports = {
  ...baseConfig,
  ...prodConfig,
}
