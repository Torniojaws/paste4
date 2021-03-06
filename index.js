const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

// MongoDB config
const config = require('config');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(config.DBHost, { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.use(cors());

// The routes must be defined AFTER bodyParser is configured
app.use('/', routes);

module.exports = app.listen(3000, () => console.log('Listening on port 3000'));
