let Paste = require('./model');

// Get all pastes from the DB
const getPastes = (req, res) => {
  // By default, we should only return items that are marked=false
  let query = Paste.find({ marked: false });

  // The query can be overridden with a GET parameter "marked"
  // all = returns everything, marked=true = returns only marked items
  if ('marked' in req.query) {
    req.query.marked === 'all'
      ? query = Paste.find({})
      : ['true', 'false'].includes(req.query.marked)
        ? query = Paste.find({ marked: req.query.marked == 'true' })
        : (query = null, res.status(400).json([]));
  }

  query.sort({ createdAt: 'desc' }).exec((err, pastes) => {
    const queryFailed = (err)
      ? res.status(500).send(err)
      : res.json(pastes);
  });
};

// Get a specific paste
const getPasteById = (req, res) => {
  Paste.findById(req.params.id, (err, paste) => {
    if (!paste) res.status(404);
    const queryFailed = (err)
      ? res.send(err)
      : res.json(paste);
  });
};

// Add a paste
const addPaste = (req, res) => {
  let item = new Paste(req.body);
  item.save((err, paste) => {
    const saveFailed = (err)
      ? res.status(400).json({ result: 'Missing \'message\' from payload' })
      : res.json({ result: 'New paste added', paste });
  });
};

// Edit a paste
const editPaste = (req, res) => {
  Paste.findById({ _id: req.params.id }, (err, paste) => {
    Object.assign(paste, req.body).save((err, paste) => {
      res.json({ result: 'Paste updated', paste });
    });
  });
};

// Delete a paste AKA mark it away, as we don't really delete them
const deletePaste = (req, res) => {
  Paste.findById({ _id: req.params.id }, (err, paste) => {
    if (!paste) {
      res.status(404).json({ result: 'Paste not found' });
      return;
    }
    paste.marked = true;
    paste.updatedAt = new Date();
    paste.save((err) => {
      err
        ? res.status(400).json({ result: err })
        : res.json({ result: 'Paste marked' });
    });
  });
};

module.exports = {
  getPastes,
  getPasteById,
  addPaste,
  editPaste,
  deletePaste,
};
