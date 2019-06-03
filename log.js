const log = require('logger3');
const color = log.color;

const makeLog = (name, color) => log.make(color).prefix(log.format.bracket(name)).make(color.reset);

module.exports = {
  // used in cli operations.
  info:  makeLog('INFO', color.blue),
  warn:  makeLog('WARN', color.yellow),
  error: makeLog('ERROR', color.red),
  done: makeLog('DONE', color.green),
  // used in cli operations.
  name: makeLog('Fullstack System', color.green),
};
