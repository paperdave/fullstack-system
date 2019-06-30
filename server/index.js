export let io;
export let app;
export let appStart;

// eslint-disable-next-line no-underscore-dangle
export function __update(name, value) {
  if (name === 'io') {
    io = value;
    return;
  }
  if (name === 'app') {
    app = value;
    return;
  }
  if (name === 'appStart') {
    appStart = value;
    return;
  }
}
