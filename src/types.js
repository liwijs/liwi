export type InsertType = {};
export type UpdateType = {};
export type ResultType = {
  created: Date,
};

export type CursorInterfaceType = {
  // store: StoreInterface,

  close(): Promise<void> | void,

  next(): Promise<any>,

  nextResult(): Promise<any>,

  limit(newLimit: number): Promise<void>,

  count(applyLimit: ?boolean): Promise<number>,

  result(): Promise<ResultType>,

  delete(): Promise<void>,

  forEachKeys(callback: Function): Promise<void>,

  forEach(callback: Function): Promise<void>,
};

export type StoreInterfaceType = {
  create(): Promise<void>,

  insertOne(object: InsertType): Promise<ResultType>,

  replaceOne(object: InsertType): Promise<ResultType>,

  upsertOne(object: InsertType): Promise<ResultType>,

  updateSeveral(objects: Array<UpdateType>): Promise<Array<ResultType>>,

  partialUpdateByKey(key: any, partialUpdate: UpdateType): Promise<ResultType>,

  partialUpdateOne(object: ResultType, partialUpdate: UpdateType): Promise<ResultType>,

  partialUpdateMany(criteria: Object, partialUpdate: UpdateType): Promise<void>,

  deleteByKey(key: any): Promise<void>,

  cursor(criteria: ?Object, sort: ?Object): Promise<CursorInterfaceType<ResultType>>,

  findAll(criteria: ?Object, sort: ?Object): Promise<Array<ResultType>>,

  findByKey(key: any): Promise<?ResultType>,

  findOne(criteria: Object, sort: ?Object): Promise<?ResultType>,
};
