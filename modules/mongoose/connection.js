const mongoose = require('mongoose');

const resolve = require('../utils/resolve');

const { mongoose: config } = require(resolve('modules/config'))(process.env.NODE_ENV);

const { user, password, host, port, name } = config.database;

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${user}:${password}@${host}:${port}/${name}`, config.options);

// MongoDB events handlers
let timeoutId = null;

mongoose.connection.on('error', (error) => {
  console.log('MONGODB', error);
}).on('disconnected', () => {
  console.log('MONGODB', 'Mongoose disconnected\nTrying to reconnect…');

  // Wait for reconnect
  timeoutId = setTimeout(() => {
    console.log('MONGODB', 'Couldn’t reconnect to MongoDB — app terminated.');

    // Exit with error code
    process.exit(1);
  }, config.reconnectTimeoutMS);
}).on('connected', () => {
  console.log('MONGODB', 'Mongoose connected');

  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});

module.exports = mongoose.connection;
