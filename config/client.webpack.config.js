const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const deepmerge = require('deepmerge');

// eslint-disable-next-line no-underscore-dangle
const SYSTEM_DIR = process.env.__SYSTEM_DIR;
const SOURCE_DIR = process.cwd();
const development = process.env.NODE_ENV !== 'production';

let indexHTMLPath = path.join(SYSTEM_DIR, 'index.html');
if(fs.existsSync(path.join(SOURCE_DIR, 'index.html'))) {
  indexHTMLPath = path.join(SOURCE_DIR, 'index.html');
}

let config = {};
if (fs.existsSync(path.join(SOURCE_DIR, 'client.webpack.config.js'))) {
  config = deepmerge(config, eval('require')(path.join(SOURCE_DIR, 'client.webpack.config.js')), { clone: false });
}
if (fs.existsSync(path.join(SOURCE_DIR, 'webpack.client.config.js'))) {
  config = deepmerge(config, eval('require')(path.join(SOURCE_DIR, 'webpack.client.config.js')), { clone: false });
}
if (fs.existsSync(path.join(SOURCE_DIR, 'webpack.config.js'))) {
  config = deepmerge(config, eval('require')(path.join(SOURCE_DIR, 'webpack.config.js')), { clone: false });
}

let htmlPluginConfig = {};
if (config.html) {
  htmlPluginConfig = config.html;
  delete config.html;
}

config = deepmerge({
  entry: [
    ...development ? ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'] : [],
    path.join(SOURCE_DIR, 'src/client/index.js'),
  ],
  output: {
    path: development ? path.join(SYSTEM_DIR, '.temp') : path.join(SOURCE_DIR, 'dist'),
    publicPath: '/',
    filename: 'client.js',
  },
  devServer: {
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            extends: path.join(SYSTEM_DIR, 'config/babel.config.js'),
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: indexHTMLPath,
      hash: true,
      minify: process.env.NODE_ENV === 'production',
      ...htmlPluginConfig,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    extensions: ['.jsx', '.js', '.json'],
    mainFields: ['fullstack-system-client', 'browser', 'module', 'main'],
    modules: [
      path.join(SOURCE_DIR, 'src'),
      path.join(SYSTEM_DIR, 'node_modules'),
      path.join(SOURCE_DIR, 'node_modules'),
      path.join(SOURCE_DIR, 'node_modules/@babel/runtime-corejs2/node_modules'),
    ],
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
}, config, {
  clone: false,
});


if (config.loaders) {
  config = deepmerge(config, {
    module: {
      rules: config.loaders,
    },
  });
  delete config.loaders;
}

module.exports = config;
