const path = require('path');

const rootPath = path.join(__dirname, '../..');

module.exports = (absolutePath) => path.resolve(rootPath, absolutePath);
