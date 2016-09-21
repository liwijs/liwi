export type CursorInterface<ModelType> = {
    // store: StoreInterface,

    close(): Promise|void,

    next(): Promise<any>,

    nextResult(): Promise<any>,

    limit(newLimit: number): Promise,

    count(applyLimit: ?boolean): Promise,

    result(): Promise<ModelType>,

    delete(): Promise,

    forEachKeys(callback: Function): Promise,

    forEach(callback: Function): Promise,
};

export type StoreInterface<ModelType> = {
    create(): Promise,

    insertOne(object: ModelType): Promise<ModelType>,

    replaceOne(object: ModelType): Promise<ModelType>,

    upsertOne(object: ModelType): Promise<ModelType>,

    updateSeveral(objects: Array<ModelType>): Promise<Array<ModelType>>,

    partialUpdateByKey(key: any, partialUpdate: Object): Promise<ModelType>,

    partialUpdateOne(object: ModelType, partialUpdate: Object): Promise<ModelType>,

    partialUpdateMany(criteria: Object, partialUpdate: Object): Promise,

    deleteByKey(key: any): Promise<void>,

    cursor(criteria: ?Object, sort: ?Object): Promise<CursorInterface<ModelType>>,

    findAll(criteria: ?Object, sort: ?Object): Promise<Array<ModelType>>,

    findByKey(key: any): Promise<?ModelType>,

    findOne(criteria: Object, sort: ?Object): Promise<?ModelType>,
};
