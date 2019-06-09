const log = require('logger3');
const color = log.color;

const makeLog = (name, color) => log.make(color).prefix(log.format.bracket(name)).make(color.reset);

module.exports = {
  info:  makeLog('INFO', color.blue),
  warn:  makeLog('WARN', color.yellow),
  error: makeLog('ERROR', color.red),
  done: makeLog('DONE', color.green),

  name: makeLog('Fullstack System', color.green),
  server: makeLog('Server', color.greenBright),
  serverError: makeLog('Server', color.red),
  serverWarn: makeLog('Server', color.yellow),
  client: makeLog('Client', color.greenBright),
  clientError: makeLog('Client', color.greenBright),
  clientWarn: makeLog('Client', color.yellow),
};
