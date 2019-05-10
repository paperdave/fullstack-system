process.env.NODE_ENV = 'production';

const npmRunScript = require('npm-run-script');
const path = require('path');

npmRunScript(
  `webpack --config ${path.join(__dirname, '../config/server.webpack.config.js')}`
);
