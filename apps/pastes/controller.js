let mongoose = require('mongoose');
let Paste = require('./model');

// Get all pastes from the DB
function getPastes(req, res) {
  let query = Paste.find({});
  query.exec((err, pastes) => {
    if (err) res.send(err);
    res.json(pastes);
  });
}

// Get a specific paste
function getPasteById(req, res) {
  Paste.findById(req.params.id, (err, paste) => {
    if (err) res.send(err);
    res.json(paste);
  });
}

// Add a paste
console.log("Implement POST /pastes here");

// Edit a paste
console.log("Implement PUT /pastes/:id here");

// Delete a paste
console.log("Implement DELETE /pastes/:id here");

module.exports = { getPastes, getPasteById }
