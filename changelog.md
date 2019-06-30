# Changelog

# 2.2.3 [2019-06-29]
- Change routing slightly

# 2.2.2 [2019-06-23]
- Add `-p` to change ports, and also looks at `$PORT`

# 2.0.5 [2019-06-08]
- Downgrade `core-js` to version 2

# 2.0.0 [2019-06-08]
- Added `clean` and `production` commands
- Rewrote starter template
- Clean up logging
- Fix some webpack configuration problems.
- Typescript definitions
- **breaking change**: You import `fullstack-system` instead of `@fullstack-system`
- **breaking change**: You import `connect` on client instead of `io`

# 1.4.0 [2019-06-01]
- Add build script
- Various babel plugins enabled by default now.

# 1.3.2 [2019-05-31]
- Change webpack to make absolute paths (inside src) work.

# 1.3.1 [2019-05-31]
- Bugfix: Removed warnings about config files.

# 1.3.0 [2019-05-10]
- You can extend webpack configs by adding
  - `webpack.config.js` global changes
  - `client.webpack.config.js` client webpack changes
  - `server.webpack.config.js` server webpack changes
  - `babel.config.js` babel changes

# 1.2.0 [2019-05-10]
- You can replace the default index.html by updating `src/index.html`

# 1.1.0 [2019-05-10]
- `src/static` folder for static resources.
- Remake the `useSocket` hook, it is now a single global socket.

# 1.0.0 [2019-05-10]
- Initial Version
- Missing Build and Production commands.
