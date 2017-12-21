const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const apiRouter = require('./modules/router/api');
const config = require('./modules/config')(process.env.NODE_ENV);
const connection = require('./modules/mongoose/connection');

const port = process.env.PORT || config.http.port || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);

// 500 Middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('500 | Internal Server Error');
});

// Restrict direct access to *.html files
app.use((req, res, next) => {
  const { url } = req;

  if (new RegExp(/\/.+\.html/).test(url)) {
    res.status(403).send('403 | Forbidden');
  }
  next();
});

app.use(express.static('dist'));

// Redirect all non-file requests to index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

connection.once('open', () => {
  app.listen(port, () => console.log(`Listening on ${port}...`));
});
