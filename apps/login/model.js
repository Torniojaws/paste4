let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the format for Tokens
let TokenSchema = new Schema(
  {
    access_token: { type: String, required: true },
    expires_at: { type: Date, default: new Date(new Date().getTime() + 3600000) },
    refresh_token: { type: String, required: true },
    username: { type: String, required: true },
  }
);

module.exports = mongoose.model('token', TokenSchema);
