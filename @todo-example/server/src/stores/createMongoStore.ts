import { config } from "alp-node";
import type { MongoBaseModel } from "liwi-mongo";
import { MongoStore, MongoConnection } from "liwi-mongo";

export { createMongoSubscribeStore } from "liwi-mongo";

type DbConfig = Map<"mongodb", Map<string, number | string>>;

const mongoConfig = config.get<DbConfig>("db").get("mongodb");
if (!mongoConfig) throw new Error("Invalid mongo config (db.mongodb)");

if (process.env.MONGO_PORT) mongoConfig.set("port", process.env.MONGO_PORT);

export const mongoConnection: MongoConnection = new MongoConnection(
  mongoConfig,
);

export const createMongoStore = <Model extends MongoBaseModel>(
  collectionName: string,
): MongoStore<Model> => {
  return new MongoStore(mongoConnection, collectionName);
};
