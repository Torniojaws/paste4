'use strict';

let config = require('config');
let uuid = require('uuid/v4');
let Token = require('./model');

// Only one valid user exists, which is in the ENV-based config
const validate = (payload) => {
  return 'username' in payload && 'password' in payload
    ? (payload.username === config.Username && payload.password === config.Password)
    : false;
};

const generateToken = (token) => {
  return token.length === 0
    ? { access: uuid(), refresh: uuid() }
    : { access: uuid(), refresh: token.refresh_token ? token.refresh_token : uuid() };
};

const getUser = (username) => {
  return Token.find({ username: username });
};

const isLoggedIn = (user) => {
  return user.length === 0
    ? false
    : new Date(user[0].expires_at).getTime() > new Date().getTime();
};

const buildResponse = (login) => {
  return getUser(login.username) // Returns an empty object on error {}
    .then((user) => {
      if (isLoggedIn(user)) return { success: true, message: 'Already logged in' };
      const tokens = generateToken(user);
      return {
        success: true,
        message: 'Enter the Paste',
        access_token: tokens.access,
        refresh_token: tokens.refresh,
        expires_in: 3600,
      };
    });
};

const doLogin = (req, res) => {
  validate(req.body)
    ? buildResponse(req.body)
        .then(result => res.json(result))
    : res.status(401).json({ success: false, message: 'Invalid login' });
};

// TODO: use Joi
const validateLogout = (payload) => {
  if (payload.username === null || payload.access_token === null) return false;
  return (payload.username.length > 0 && payload.access_token.length > 0);
};

const deleteToken = (username) => {
  return Token.remove({ username: username }).exec();
};

const logout = (req, res) => {
  validateLogout(req.body)
    ? deleteToken(req.body.username).then(res.status(200).json({ success: true, message: 'Logged out' }))
    : res.status(400).json({ success: false, message: 'Invalid payload' });
};

module.exports = {
  doLogin,
  generateToken,
  logout,
  validateLogout,
};
