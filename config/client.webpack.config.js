const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const deepmerge = require('deepmerge');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');

// eslint-disable-next-line no-underscore-dangle
const SYSTEM_DIR = process.env.__SYSTEM_DIR;
const SOURCE_DIR = process.cwd();
const development = process.env.NODE_ENV !== 'production';

const tsEnabled = fs.existsSync(path.join(SOURCE_DIR, 'tsconfig.json'));

let indexHTMLPath = path.join(SYSTEM_DIR, 'index.html');
if (fs.existsSync(path.join(SOURCE_DIR, 'index.html'))) {
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

let enableReactDom = true;
try {
  eval('require.resolve("react-dom")');
} catch (error) {
  enableReactDom = false;
}

let appEntry = '';
function tryFindEntry(ext) {
  const f = path.join(SOURCE_DIR, 'src/client/index.' + ext);
  if (fs.existsSync(f)) {
    appEntry = f;
    return true;
  }
}

tryFindEntry('js')
|| tryFindEntry('jsx')
|| tsEnabled
&& (
  tryFindEntry('ts')
  || tryFindEntry('tsx')
)
|| (() => {
  throw new Error(
    'Cannot Find a Client Entry File. Add a ./src/client/index.js or .ts file.'
  + ' (TypeScript requires a tsconfig.json)'
  );
})();

config = deepmerge({
  entry: [
    ...development ? ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'] : [],
    appEntry,
  ],
  devtool: development
    ? 'cheap-module-source-map'
    : 'source-map',
  output: {
    path: development ? path.join(SYSTEM_DIR, '.temp') : path.join(SOURCE_DIR, 'dist'),
    publicPath: '/',
    filename: 'client.js',
    devtoolModuleFilenameTemplate: development
      ? (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
      : (info) => path.relative(SOURCE_DIR, 'src', info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  devServer: {
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            extends: path.join(SYSTEM_DIR, 'config/babel.config.js'),
            cacheDirectory: true,
            cacheCompression: !development,
            compact: !development,
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
    tsEnabled && new ForkTsCheckerWebpackPlugin({
      typescript: eval('require.resolve')('typescript'),
      async: development,
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      tsconfig: path.join(SOURCE_DIR, 'tsconfig.json'),
      reportFiles: [
        '**',
        '!**/__tests__/**',
        '!**/?(*.)(spec|test).*',
        '!**/src/setupProxy.*',
        '!**/src/setupTests.*',
      ],
      watch: path.join(SOURCE_DIR, 'src'),
      // The formatter is invoked directly in WebpackDevServerUtils during development
      formatter: typescriptFormatter,
    }),
  ],
  resolve: {
    alias: {
      ...enableReactDom && {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    extensions: ['.jsx', '.js', '.json', '.tsx', '.ts'],
    mainFields: ['fullstack-system-client', 'browser', 'module', 'main'],
    modules: [
      path.join(SOURCE_DIR, 'src'),
      path.join(SYSTEM_DIR, 'node_modules'),
      path.join(SOURCE_DIR, 'node_modules'),
      path.join(SOURCE_DIR, 'node_modules/@babel/runtime-corejs2/node_modules'),
    ],
  },
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
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
