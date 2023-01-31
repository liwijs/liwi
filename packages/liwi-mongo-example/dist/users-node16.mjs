import assert from 'assert';
import { MongoConnection, MongoStore } from 'liwi-mongo';

const connection = new MongoConnection(new Map([['database', 'liwi-mongo-example']]));
const users = new MongoStore(connection, 'users');
await users.deleteMany({});
const allUsers = await users.findAll();
assert(allUsers.length === 0, 'Database is not empty');
const user = {
  firstname: 'John',
  lastname: 'Doe',
  groups: []
};
const insertedUser = await users.insertOne(user);
assert(insertedUser === user);
assert(insertedUser.created);
assert(insertedUser.updated);
await users.partialUpdateMany({
  firstname: 'John'
}, {
  $set: {
    firstname: 'Johnny'
  }
});
const modifiedUser = await users.findOne({
  firstname: 'Johnny'
});
assert(modifiedUser?._id === insertedUser._id);
await users.partialUpdateMany({
  firstname: 'Johnny'
}, {
  $push: {
    groups: 'Music'
  }
});
const modifiedUserWithGroup = await users.findByKey(insertedUser._id);
assert(modifiedUserWithGroup?.groups.length === 1);
await connection.close();
//# sourceMappingURL=users-node16.mjs.map
