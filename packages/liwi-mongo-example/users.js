var production = process.env.NODE_ENV === 'production';
module.exports = require('./dist/users-node10' + (production ? '' : '-dev') + '.cjs');
