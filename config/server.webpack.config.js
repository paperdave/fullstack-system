const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');

const SYSTEM_DIR = path.join(__dirname, '../');
const SOURCE_DIR = process.cwd();
const development = process.env.NODE_ENV !== 'production';

const deepmerge = require('deepmerge');
const fs = require('fs');

const tsEnabled = fs.existsSync(path.join(SOURCE_DIR, 'tsconfig.json'));

const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));
const root = pkg['fullstack-system'] && pkg['fullstack-system'].root || 'src';
const server = pkg['fullstack-system'] && pkg['fullstack-system'].server || 'server';
const dist = pkg['fullstack-system'] && pkg['fullstack-system'].dist || 'dist';

let config = {};
if (fs.existsSync(path.join(SOURCE_DIR, 'server.webpack.config.js'))) {
  config = deepmerge(config, require(path.join(SOURCE_DIR, 'server.webpack.config.js')), { clone: false });
}
if (fs.existsSync(path.join(SOURCE_DIR, 'webpack.server.config.js'))) {
  config = deepmerge(config, require(path.join(SOURCE_DIR, 'webpack.server.config.js')), { clone: false });
}
if (fs.existsSync(path.join(SOURCE_DIR, 'webpack.config.js'))) {
  config = deepmerge(config, require(path.join(SOURCE_DIR, 'webpack.config.js')), { clone: false });
}

config = deepmerge({
  entry: [
    ...development ? ['webpack/hot/poll?1000'] : [],
    path.join(SYSTEM_DIR, '.temp/webpack-server-entry.js'),
  ],
  watch: development,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000', 'fullstack-system', 'core-js'],
      modulesDir: path.join(SYSTEM_DIR, 'node_modules'),
    }),
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000', 'fullstack-system', 'core-js'],
      modulesDir: path.join(SOURCE_DIR, 'node_modules'),
    }),
  ],
  module: {
    rules: [{
      test: /\.(j|t)sx?$/,
      use: {
        loader: require.resolve('babel-loader'),
        options: {
          extends: require.resolve('./babel.config'),
          cacheDirectory: true,
          cacheCompression: !development,
          compact: !development,
        },
      },
      exclude: /node_modules|fullstack-system\/config\/client\.webpack\.config\.js/,
    }],
  },
  plugins: [
    development && new StartServerPlugin('server.js'),
    development && new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.__SYSTEM_DIR': JSON.stringify(SYSTEM_DIR),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.PRODUCTION': JSON.stringify(process.env.NODE_ENV === 'production'),
      'process.env.IS_CLIENT': JSON.stringify(false),
      'process.env.IS_SERVER': JSON.stringify(true),
    }),
    tsEnabled && new ForkTsCheckerWebpackPlugin({
      typescript: eval('require.resolve')('typescript'),
      async: development,
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      tsconfig: path.join(SOURCE_DIR, 'tsconfig.json'),
      reportFiles: [
        '**',
      ],
      watch: path.join(SOURCE_DIR, root, server),
      // The formatter is invoked directly in WebpackDevServerUtils during development
      formatter: typescriptFormatter,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      'fullstack-system': path.join(SYSTEM_DIR, 'server/index.js'),
    },
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    mainFields: ['fullstack-system-server', 'browser', 'module', 'main'],
    modules: [
      path.join(SOURCE_DIR, root),
      path.join(SYSTEM_DIR, 'node_modules'),
      path.join(SOURCE_DIR, 'node_modules'),
      path.join(SOURCE_DIR, 'node_modules/@babel/runtime-corejs2/node_modules'),
    ],
  },
  output: {
    path: development ? path.join(SYSTEM_DIR, '.temp') : path.join(SOURCE_DIR, dist),
    filename: 'server.js',
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  node: {
    __dirname: true,
  },
  optimization: {
    namedModules: true,
    noEmitOnErrors: true,
  },
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
if (config.html) {
  delete config.html;
}

module.exports = config;
