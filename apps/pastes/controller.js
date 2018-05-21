let mongoose = require('mongoose');
let Paste = require('./model');

// Get all pastes from the DB
function getPastes(req, res) {
  let query = Paste.find({});
  query.exec((err, pastes) => {
    const queryFailed = (err)
      ? res.send(err)
      : res.json(pastes);
  });
}

// Get a specific paste
function getPasteById(req, res) {
  Paste.findById(req.params.id, (err, paste) => {
    if (!paste) res.status(404);
    const queryFailed = (err)
      ? res.send(err)
      : res.json(paste);
  });
}

// Add a paste
function addPaste(req, res) {
  let item = new Paste(req.body);
  item.save((err, paste) => {
    const saveFailed = (err)
      ? res.status(400).json({ result: 'Missing \'message\' from payload' })
      : res.json({ result: 'New paste added', paste });
  });
}

// Edit a paste
function editPaste(req, res) {
  Paste.findById({ _id: req.params.id}, (err, paste) => {
    Object.assign(paste, req.body).save((err, paste) => {
      res.json({ result: 'Paste updated', paste });
    });
  });
}

// Delete a paste
console.log("Implement DELETE /pastes/:id here");

module.exports = {
  getPastes,
  getPasteById,
  addPaste,
  editPaste,
}
