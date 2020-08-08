import { SubscribeStore } from 'liwi-subscribe-store';
import { AllowedKeyValue } from 'liwi-types';
import {
  MongoBaseModel,
  MongoKeyPath,
  MongoInsertType,
} from './MongoBaseModel';
import MongoConnection from './MongoConnection';
import MongoStore from './MongoStore';

export default function createMongoSubscribeStore<
  Model extends MongoBaseModel<KeyValue>,
  KeyValue extends AllowedKeyValue = Model[MongoKeyPath],
  ModelInsertType extends MongoInsertType<Model> = MongoInsertType<Model>
>(
  mongoStore: MongoStore<Model, KeyValue, ModelInsertType>,
): SubscribeStore<
  MongoKeyPath,
  KeyValue,
  Model,
  ModelInsertType,
  MongoConnection,
  MongoStore<Model, KeyValue, ModelInsertType>
> {
  return new SubscribeStore(mongoStore);
}
