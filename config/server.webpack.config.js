const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')

const SYSTEM_DIR = path.join(__dirname, '../');
const SOURCE_DIR = process.cwd();
const development = process.env.NODE_ENV !== 'production';

console.log(path.resolve(path.join(SYSTEM_DIR, 'server')));

module.exports = {
  entry: [
    ...development ? ['webpack/hot/poll?1000'] : [],
    path.join(SYSTEM_DIR, '.temp/webpack-server-entry.js'),
  ],
  watch: development,
  target: 'node',
  externals: [nodeExternals({
    whitelist: ['webpack/hot/poll?1000']
  })],
  module: {
    rules: [{
      test: /\.js?$/,
      use: {
        loader: require.resolve('babel-loader'),
        options: {
          extends: require.resolve('./babel.config'),
        },
      },
      exclude: /node_modules/,
    }]
  },
  plugins: [
    ...development ? [
      new StartServerPlugin('server.js'),
      new webpack.HotModuleReplacementPlugin(),
    ] : [],
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        '__SYSTEM_DIR': JSON.stringify(SYSTEM_DIR),
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }
    }),
  ],
  resolve: {
    alias: {
      '@fullstack-system': path.join(SYSTEM_DIR, 'server/index.js'),
    },
    extensions: ['.js', '.json', '.jsx']
  },
  output: {
    path: development ? path.join(SYSTEM_DIR, '.temp') : path.join(SOURCE_DIR, 'dist'),
    filename: 'server.js'
  },
  mode: 'development',
  node: {
    __dirname: true,
  },
}
