import assert from 'assert';
import { MongoConnection, MongoStore } from 'liwi-mongo';

const connection = new MongoConnection(new Map([['database', 'liwi-mongo-example']]));
const users = new MongoStore(connection, 'users');
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
  await connection.close();
  // eslint-disable-next-line unicorn/prefer-top-level-await
})().catch(err => {
  console.error(err);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});
//# sourceMappingURL=users-node16.mjs.map
