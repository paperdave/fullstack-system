const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const fs = require('fs');

// eslint-disable-next-line no-underscore-dangle
const SYSTEM_DIR = process.env.__SYSTEM_DIR;
const SOURCE_DIR = process.cwd();
const development = process.env.NODE_ENV !== 'production';

let indexHTMLPath = path.join(SYSTEM_DIR, 'index.html');
if(fs.existsSync(path.join(SOURCE_DIR, 'index.html'))) {
  indexHTMLPath = path.join(SOURCE_DIR, 'index.html');
}

module.exports = {
  entry: [
    ...development ? [ 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000' ] : [],
    path.join(SOURCE_DIR, 'src/client/index.js'),
  ],
  output: {
    path: path.join(SOURCE_DIR, 'dist'),
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
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
      '@fullstack-system': path.join(SYSTEM_DIR, 'client'),
    },
    extensions: ['.jsx', '.js', '.json'],
    modules: [ path.join(SOURCE_DIR, 'node_modules') ],
  },
  mode: 'development',
};
