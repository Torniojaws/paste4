const app = require('express')();
const bodyParser = require('body-parser');
const routes = require('./routes');

// MongoDB config
const config = require('config');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(config.DBHost);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use('/', routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

module.exports = app.listen(3000, () => console.log('Listening on port 3000'));
