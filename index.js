const app = require('express')();
const routes = require('./routes');

// Connect all routes
app.use('/', routes);

module.exports = app.listen(3000, () => console.log('Listening on port 3000'));
