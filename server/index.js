export let io;
export let app;

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
}
