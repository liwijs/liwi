import { SubscribeStore } from 'liwi-subscribe-store';
import { AllowedKeyValue } from 'liwi-types';
import { MongoBaseModel, MongoInsertType, MongoKeyPath } from './MongoBaseModel';
import MongoConnection from './MongoConnection';
import MongoStore from './MongoStore';
export default function createMongoSubscribeStore<Model extends MongoBaseModel<KeyValue>, KeyValue extends AllowedKeyValue = Model[MongoKeyPath]>(mongoStore: MongoStore<Model, KeyValue>): SubscribeStore<MongoKeyPath, KeyValue, Model, MongoInsertType<Model, KeyValue>, MongoConnection, MongoStore<Model, KeyValue>>;
//# sourceMappingURL=createMongoSubscribeStore.d.ts.map