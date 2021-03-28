import { config } from 'alp-node';
import type { MongoBaseModel } from 'liwi-mongo';
import { MongoStore, MongoConnection } from 'liwi-mongo';

export { createMongoSubscribeStore } from 'liwi-mongo';

type DbConfig = Map<'mongodb', Map<string, string | number>>;

export const mongoConnection: MongoConnection = new MongoConnection(
  config.get<DbConfig>('db').get('mongodb')!,
);

export const createMongoStore = <Model extends MongoBaseModel>(
  collectionName: string,
): MongoStore<Model> => {
  return new MongoStore(mongoConnection, collectionName);
};
