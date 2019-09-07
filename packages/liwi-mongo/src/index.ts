import * as MongoStoreExports from './MongoStore';

export { default as MongoStore } from './MongoStore';
export { default as MongoConnection } from './MongoConnection';

export type MongoModel = MongoStoreExports.MongoModel;
export type MongoKeyPath = MongoStoreExports.MongoKeyPath;
export type MongoInsertType<
  Model extends MongoModel
> = MongoStoreExports.MongoInsertType<Model>;
