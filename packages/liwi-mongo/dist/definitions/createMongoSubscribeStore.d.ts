import type { AllowedKeyValue } from "liwi-store";
import { SubscribeStore } from "liwi-subscribe-store";
import type { MongoBaseModel, MongoInsertType, MongoKeyPath } from "./MongoBaseModel";
import type MongoConnection from "./MongoConnection";
import type MongoStore from "./MongoStore";
export default function createMongoSubscribeStore<Model extends MongoBaseModel<KeyValue>, KeyValue extends AllowedKeyValue = Model[MongoKeyPath]>(mongoStore: MongoStore<Model, KeyValue>): SubscribeStore<MongoKeyPath, KeyValue, Model, MongoInsertType<Model, KeyValue>, MongoConnection, MongoStore<Model, KeyValue>>;
export { type SubscribeStore } from "liwi-subscribe-store";
//# sourceMappingURL=createMongoSubscribeStore.d.ts.map