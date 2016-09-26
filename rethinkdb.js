// TODO external package
var production = process.env.NODE_ENV === 'production';
return module.exports = production ? require('./lib-node6/rethinkdb') : require('./lib-node6-dev/rethinkdb');
