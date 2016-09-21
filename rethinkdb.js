// TODO external package
var production = process.env.NODE_ENV === 'production';
return module.exports = require('./lib-node6' + (production ? '' : '-dev') + '/rethinkdb');
// help autocomplete
module.exports = require('./src/rethinkdb');
