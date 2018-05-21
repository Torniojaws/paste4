const express = require('express');
const app = express();
const pastes = require('./apps/pastes/controller');

// Root
app.get('/', (req, res) => res.status(200).json({ message: "Hello there" }));

// Pastes
app.route('/pastes')
  .get(pastes.getPastes)
  .post(pastes.addPaste);
app.route('/pastes/:id')
  .get(pastes.getPasteById)
  .put(pastes.editPaste);
  // .delete(pastes.delete)

module.exports = app;
