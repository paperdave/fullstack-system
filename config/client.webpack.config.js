const shouldUseSourceMap = false;

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const deepmerge = require('deepmerge');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const postcssNormalize = require('postcss-normalize');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

const requireResolve = eval('require.resolve');

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
  eval('require.resolve ("react-dom")');
} catch (error) {
  enableReactDom = false;
}

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getStyleLoaders = (cssOptions, scss) => {
  const loaders = [
    development && requireResolve('style-loader'),
    !development && {
      loader: MiniCssExtractPlugin.loader,
      options: { publicPath: '../' },
    },
    tsEnabled && cssOptions.modules && {
      loader: requireResolve('css-modules-typescript-loader'),
    },
    {
      loader: requireResolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: requireResolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize(),
        ],
        sourceMap: !development && shouldUseSourceMap,
      },
    },
  ].filter(Boolean);
  if (scss) {
    loaders.push(
      {
        loader: requireResolve('sass-loader'),
        options: {
          sourceMap: !development && shouldUseSourceMap,
        },
      }
    );
  }
  return loaders;
};

config = deepmerge({
  entry: [
    ...development ? ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'] : [],
    path.join(SOURCE_DIR, 'src/client/'),
  ],
  devtool: development
    ? 'cheap-module-source-map'
    : shouldUseSourceMap && 'source-map',
  output: {
    path: development ? path.join(SYSTEM_DIR, '.temp') : path.join(SOURCE_DIR, 'dist'),
    publicPath: '/',
    filename: 'static/client.js',
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
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: requireResolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/[hash:8].[ext]',
            },
          },
          {
            test: /\.(j|t)sx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  extends: path.join(SYSTEM_DIR, 'config/babel.config.js'),
                  cacheDirectory: true,
                  cacheCompression: !development,
                  compact: !development,
                },
              },
              {
                loader: path.join(SYSTEM_DIR, 'plugins/auto-react-hot-loader.js'),
              },
            ],
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: !development && shouldUseSourceMap,
            }),
            sideEffects: true,
          },
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: !development && shouldUseSourceMap,
              modules: true,
              getLocalIdent: getCSSModuleLocalIdent,
            }),
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: !development && shouldUseSourceMap,
              },
              true
            ),
            sideEffects: true,
          },
          {
            test: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: !development && shouldUseSourceMap,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent,
              },
              true
            ),
          },
          {
            exclude: [/\.(js|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            use: {
              loader: requireResolve('file-loader'),
              options: {
                name: 'static/[hash:8].[ext]',
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: indexHTMLPath,
      hash: true,
      minify: process.env.NODE_ENV === 'production'
        ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        }
        : false,
      ...htmlPluginConfig,
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
    new ModuleNotFoundPlugin(),
    development && new CaseSensitivePathsPlugin(),
    development && new webpack.HotModuleReplacementPlugin(),
    development && new WatchMissingNodeModulesPlugin(path.join(SOURCE_DIR, 'node_modules')),
    tsEnabled && new ForkTsCheckerWebpackPlugin({
      typescript: requireResolve('typescript'),
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
    !development && new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/[contenthash:8].css',
      chunkFilename: 'static/[contenthash:8].chunk.css',
    }),
  ].filter(Boolean),
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
