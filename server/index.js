// aliased to "magic-loading"
export let io;
export let app;

export function __update(name, value) {
  if (name === 'io') return io = value;
  if (name === 'app') return app = value;
}

export function createState(initialValue) {
  return initialValue;
}
