import assert from "node:assert";
import { MongoConnection, MongoStore } from "liwi-mongo";
import type { MongoBaseModel, MongoInsertType } from "liwi-mongo";

const connection = new MongoConnection(
  new Map([["database", "liwi-mongo-example"]]),
);

interface User extends MongoBaseModel {
  created: Date;
  updated: Date;
  firstname: string;
  lastname: string;
  groups: string[];
}

const users = new MongoStore<User>(connection, "users");

await users.deleteMany({});
const allUsers = await users.findAll();

assert.ok(allUsers.length === 0, "Database is not empty");

const user: MongoInsertType<User> = {
  firstname: "John",
  lastname: "Doe",
  groups: [],
};
const insertedUser = await users.insertOne(user);

assert.ok(insertedUser === user);

assert.ok(insertedUser.created);
assert.ok(insertedUser.updated);

await users.partialUpdateMany(
  { firstname: "John" },
  { $set: { firstname: "Johnny" } },
);
const modifiedUser = await users.findOne({ firstname: "Johnny" });
assert.ok(modifiedUser?._id === insertedUser._id);

await users.partialUpdateMany(
  { firstname: "Johnny" },
  { $push: { groups: "Music" } },
);

const modifiedUserWithGroup = await users.findByKey(insertedUser._id);
assert.ok(modifiedUserWithGroup?.groups.length === 1);

await connection.close();
