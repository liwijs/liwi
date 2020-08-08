// eslint-disable-next-line max-classes-per-file
import { config } from 'alp-node';
import { MongoStore, MongoConnection, MongoBaseModel } from 'liwi-mongo';

export { createMongoSubscribeStore } from 'liwi-mongo';

export const mongoConnection: MongoConnection = new MongoConnection(
  config.get('db').get('mongodb'),
);

export const createMongoStore = <Model extends MongoBaseModel>(
  collectionName: string,
): MongoStore<Model> => {
  return new MongoStore(mongoConnection, collectionName);
};
