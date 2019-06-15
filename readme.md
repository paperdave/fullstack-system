# Fullstack System
> A build and development system for creating Client+Server applications with Socket.IO, React, and
> Express.

This module provides a setup for creating web applications.

## Create a new Project
```
# Create a new project
npx fullstack-system new my-app

# NPM Modules are automatically installed, so you can
# start working right away.
cd my-app
npm start
```

## Documentation
You need two entry files in your project, one at `./src/server/index.js` and one at `./src/client/index.js`. Right now you cannot have these in other places.

### Files
- `index.html` index.html template
- `src/client/index.js` Client Entry File
- `src/server/index.js` Server Entry File
- `src/static` Extra static resources mounted at root of website.
- `webpack.config.js` Webpack extension configuration.
- `client.webpack.config.js` Webpack extension configuration (only on client).
- `server.webpack.config.js` Webpack extension configuration (only on server).
- `babel.config.js` Babel config extension.

### Help: Can't find core-js!
You may need to install core js 2 with `npm i @babel/runtime-corejs2`
