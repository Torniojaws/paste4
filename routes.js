const express = require('express');
const app = express();
const pastes = require('./apps/pastes/controller');
const login = require('./apps/login/controller');

// Root
app.get('/', (req, res) => res.status(200).json({ message: "Hello there" }));

// Pastes
app.route('/pastes')
  .get(pastes.getPastes)
  .post(pastes.addPaste);
app.route('/pastes/:id')
  .get(pastes.getPasteById)
  .put(pastes.editPaste)
  .delete(pastes.deletePaste);

// Login / logout
app.route('/login')
  .post(login.doLogin);
app.route('/logout')
  .post(login.logout);

module.exports = app;
