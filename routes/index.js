const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'It is alive!' });
});

module.exports = routes;
