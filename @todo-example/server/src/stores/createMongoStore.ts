import { config } from "alp-node";
import { MongoConnection, MongoStore } from "liwi-mongo";
import type { MongoBaseModel, MongoConfig } from "liwi-mongo";

export { createMongoSubscribeStore, type SubscribeStore } from "liwi-mongo";

interface DbConfig {
  mongodb: MongoConfig;
}

const mongoConfig = config.get<DbConfig | undefined>("db")?.mongodb;
if (!mongoConfig) throw new Error("Invalid mongo config (db.mongodb)");

export const mongoConnection: MongoConnection = new MongoConnection({
  ...mongoConfig,
  ...(process.env.MONGO_PORT ? { port: process.env.MONGO_PORT } : {}),
});

export const createMongoStore = <Model extends MongoBaseModel>(
  collectionName: string,
): MongoStore<Model> => {
  return new MongoStore(mongoConnection, collectionName);
};
