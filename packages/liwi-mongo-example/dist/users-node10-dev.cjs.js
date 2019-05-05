'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const assert = _interopDefault(require('assert'));
const liwiMongo = require('liwi-mongo');

const connection = new liwiMongo.MongoConnection(new Map([['database', 'liwi-mongo-example']]));
const users = new liwiMongo.MongoStore(connection, 'users');
(async function main() {
  await users.deleteMany({});
  const allUsers = await users.findAll();
  assert(allUsers.length === 0, 'Database is not empty');
  const user = {
    firstname: 'John',
    lastname: 'Doe'
  };
  const insertedUser = await users.insertOne(user);
  assert(insertedUser === user);
  assert(insertedUser.created);
  assert(insertedUser.updated);
  connection.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
//# sourceMappingURL=users-node10-dev.cjs.js.map
