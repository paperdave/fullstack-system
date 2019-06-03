const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

const SYSTEM_DIR = path.join(__dirname, '../');
const SOURCE_DIR = process.cwd();
const development = process.env.NODE_ENV !== 'production';

const deepmerge = require('deepmerge');
const fs = require('fs');

let custom = {};
if (fs.existsSync(path.join(SOURCE_DIR, 'server.webpack.config.js'))) {
  custom = deepmerge(custom, require(path.join(SOURCE_DIR, 'server.webpack.config.js')));
}
if (fs.existsSync(path.join(SOURCE_DIR, 'webpack.config.js'))) {
  custom = deepmerge(custom, require(path.join(SOURCE_DIR, 'webpack.config.js')));
}

console.log(path.join(SOURCE_DIR, 'node_modules'));

module.exports = deepmerge({
  entry: [
    '@babel/polyfill',
    ...development ? ['webpack/hot/poll?1000'] : [],
    path.join(SYSTEM_DIR, '.temp/webpack-server-entry.js'),
  ],
  watch: development,
  target: 'node',
  externals: [nodeExternals({
    whitelist: ['webpack/hot/poll?1000'],
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
    }],
  },
  plugins: [
    ...development ? [
      new StartServerPlugin('server.js'),
      new webpack.HotModuleReplacementPlugin(),
    ] : [],
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        '__SYSTEM_DIR': JSON.stringify(SYSTEM_DIR),
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
  resolve: {
    alias: {
      '@fullstack-system': path.join(SYSTEM_DIR, 'server/index.js'),
    },
    extensions: ['.js', '.json', '.jsx'],
    mainFields: ['browser', 'module', 'main'],
    modules: ['node_modules', path.join(SOURCE_DIR, 'node_modules'), path.join(SOURCE_DIR, 'src')],
  },
  output: {
    path: development ? path.join(SYSTEM_DIR, '.temp') : path.join(SOURCE_DIR, 'dist'),
    filename: 'server.js',
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  node: {
    __dirname: true,
  },
}, custom, {
  clone: false,
});
