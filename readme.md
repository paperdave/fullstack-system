# Fullstack System
> A build and development system for creating Client+Server applications with Socket.IO, React, and
> Express.

This module provides a setup for creating web applications with a backend server and front end client. Out of the box, you
can use Socket.IO, React, and Express, all with hot reloading.

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

## Features
Out of the box, you get:

- **React Automatic Hot-Reload**. You just write React and the behind the scenes will automatically add in `react-hot-loader` to update changes without refreshing.
- **CSS Modules**, import any `.module.css`
- **TypeScript Support**, just install `typescript` and add a `tsconfig.json`
- **Sass/SCSS Support**, just install `node-sass`

## Documentation
***TODO: Fully document everything in the project.***

You need two entry files in your project, one at `./src/server/index.js` and one at `./src/client/index.js`.

### Files
- `src/static/index.html` index.html template
- `src/client/index.js` Client Entry File
- `src/server/index.js` Server Entry File
- `src/static` Extra static resources mounted at root of website.
- `webpack.config.js` Webpack extension configuration.
- `webpack.client.config.js` Webpack extension configuration (only on client).
- `webpack.server.config.js` Webpack extension configuration (only on server).
- `babel.config.js` Babel config extension.
