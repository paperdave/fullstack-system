# Using Express
Express can be used with your app get get information from the server with an HTTP request.

## Usage
To get started you must import `app` from `fullstack-system`.
```js
import { app } from 'fullstack-system';
```

Then you can use any express query with `app.get()`.
```js
import { app } from 'fullstack-system';

app.get('/hello-world/:color', (req, res) => {
  const color = req.params.color;

  res.send(`Hello World! You sent: ${color}.`);
});
```
Send stuff with `res`.
