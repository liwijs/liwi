import type { BaseModel, AllowedKeyValue, InsertType } from "liwi-store";

export type MongoKeyPath = "_id";

export interface MongoBaseModel<KeyValue extends AllowedKeyValue = string>
  extends BaseModel {
  _id: KeyValue;
}

export type MongoInsertType<
  Model extends MongoBaseModel<KeyValue>,
  KeyValue extends AllowedKeyValue = Model[MongoKeyPath],
> = InsertType<Model, MongoKeyPath>;
