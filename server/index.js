module.exports = {};

function update(name, value) {
  if (name === 'io') {
    Object.defineProperty(module.exports, 'io', { get: value });
    return;
  }
  if (name === 'app') {
    module.exports.app = value;
    return;
  }
  if (name === 'appStart') {
    module.exports.appStart = value;
    return;
  }
  if (name === 'rootRouter') {
    module.exports.rootRouter = value;
    return;
  }
}

module.exports.__update = update;
