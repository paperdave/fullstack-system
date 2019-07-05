# Fullstack System
> A build and development system for creating Client+Server applications with Socket.IO, React, and
> Express.

This module provides a setup for creating web applications with a backend server and front end client. Out of the box, you
can use Socket.IO, React, and Express, all with hot reloading, but you can use other libraries like Vue or Angular.

This framework might not be the best thing to use since the Api is not documented much, and I change the default settings
(to improve them) a lot, and I usually add features only when I need them for my own projects.

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
- `webpack.client.config.js` Webpack extension configuration (only on client).
- `webpack.server.config.js` Webpack extension configuration (only on server).
- `babel.config.js` Babel config extension.
