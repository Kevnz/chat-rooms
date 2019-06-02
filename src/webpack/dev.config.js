const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./config')

const devConfig = {
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: '"development"',
        },
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Full Stack Web App',
      template: './src/ui/index.html',
    }),
  ],
  resolve: {
    extensions: ['*', '.mjs', '.js', '.jsx'],
    modules: ['node_modules', 'src'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    hot: true,
    proxy: {
      '/graphql': 'http://localhost:4567/',
      '/api/rooms': 'http://localhost:4567/',
    },
  },
}

module.exports = {
  ...baseConfig,
  ...devConfig,
}
