'use strict';

const assert = require('assert');
const liwiMongo = require('liwi-mongo');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);

const connection = new liwiMongo.MongoConnection(new Map([['database', 'liwi-mongo-example']]));
const users = new liwiMongo.MongoStore(connection, 'users');
(async function main() {
  await users.deleteMany({});
  const allUsers = await users.findAll();
  assert__default(allUsers.length === 0, 'Database is not empty');
  const user = {
    firstname: 'John',
    lastname: 'Doe'
  };
  const insertedUser = await users.insertOne(user);
  assert__default(insertedUser === user);
  assert__default(insertedUser.created);
  assert__default(insertedUser.updated);
  await connection.close();
})().catch(err => {
  console.error(err); // eslint-disable-next-line unicorn/no-process-exit

  process.exit(1);
});
//# sourceMappingURL=users-node12.cjs.js.map
