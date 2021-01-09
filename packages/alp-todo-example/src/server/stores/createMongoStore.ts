import { config } from 'alp-node';
import type { MongoBaseModel } from 'liwi-mongo';
import { MongoStore, MongoConnection } from 'liwi-mongo';

export { createMongoSubscribeStore } from 'liwi-mongo';

export const mongoConnection: MongoConnection = new MongoConnection(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  config.get('db').get('mongodb'),
);

export const createMongoStore = <Model extends MongoBaseModel>(
  collectionName: string,
): MongoStore<Model> => {
  return new MongoStore(mongoConnection, collectionName);
};
