import { SubscribeStore } from 'liwi-subscribe-store';
import type { AllowedKeyValue } from 'liwi-types';
import type {
  MongoBaseModel,
  MongoKeyPath,
  MongoInsertType,
} from './MongoBaseModel';
import type MongoConnection from './MongoConnection';
import type MongoStore from './MongoStore';

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
