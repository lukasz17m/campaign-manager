const { Schema } = require('mongoose');

const Name = {
  type: String,
  required: true,
  unique: true,
}

const Balance = {
  type: Number,
  required: true,
  min: 0,
}

const Token = {
  type: String,
  required: true,
  default: 'secret_token',
}

module.exports = new Schema({
  name: Name,
  balance: Balance,
  token: Token,
});
