export type Except<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type SetOptional<T, K extends keyof T> = Except<T, K> &
  Partial<Pick<T, K>>;

export interface BaseModel {
  created: Date;
  updated: Date;
}

export type OptionalBaseModelKeysForInsert = keyof BaseModel;

export type AllowedKeyValue = string | number;

export type InsertType<
  Model extends BaseModel & Record<KeyPath, unknown>,
  KeyPath extends keyof Model,
> = SetOptional<Model, KeyPath | OptionalBaseModelKeysForInsert>;

// export type InsertedType<T extends BaseModel> = T;

// export type UpdateType<T extends BaseModel> = T;

// export type UpdatedType<T extends BaseModel> = Pick<T, Exclude<keyof T, 'updated'>> &
// Required<Pick<T, 'updated'>>;

export type $CurrentDateSpec =
  | true
  | { $type: 'timestamp' }
  | { $type: 'date' };

export interface Update<Model extends BaseModel> {
  /* Field Update Operators */
  $currentDate?: { [P in keyof Model]?: $CurrentDateSpec } & {
    [field: string]: $CurrentDateSpec;
  };
  $inc?: { [P in keyof Model]?: number } & { [field: string]: number };
  $min?: { [P in keyof Model]?: number } & { [field: string]: number };
  $max?: { [P in keyof Model]?: number } & { [field: string]: number };
  $mul?: { [P in keyof Model]?: number } & { [field: string]: number };
  $rename?: { [P in keyof Model]?: string } & { [field: string]: string };
  $set?: Partial<Model> & { [field: string]: any };
  $setOnInsert?: Partial<Model> & { [field: string]: any };
  $unset?: { [P in keyof Model]?: any } & { [field: string]: any };

  /* Array Update Operators */
  // Model[P] is Array ? never :
  $addToSet?: { [P in keyof Model]?: any } & { [field: string]: any };
  $pop?: { [P in keyof Model]?: 1 | -1 } & { [field: string]: 1 | -1 };
  $pull?: { [P in keyof Model]?: any } & { [field: string]: any };
  /** The $push operator appends a specified value to an array. */
  $push?: { [P in keyof Model]?: any } & { [field: string]: any };
  $pullAll?: { [P in keyof Model]?: Array<any> } & {
    [field: string]: Array<any>;
  };
}

export type ExcludeOnlyFields<Model extends BaseModel> = {
  [P in keyof Model]?: 0;
} & { [key: string]: 0 };
export type IncludeOnlyFields<Model extends BaseModel> = {
  [P in keyof Model]?: 1;
} & { [key: string]: 1 };
export type Fields<Model extends BaseModel> =
  | ExcludeOnlyFields<Model>
  | IncludeOnlyFields<Model>;

export type Criteria<Model extends BaseModel> = { [P in keyof Model]?: any } & {
  [key: string]: any;
};

export type Sort<Model extends BaseModel> = { [P in keyof Model]?: -1 | 1 } & {
  [key: string]: -1 | 1;
};

export interface QueryMeta {
  total: number;
}

export interface QueryInfo<Item extends Record<keyof Item, unknown>> {
  limit?: number;
  sort?: Sort<any>;
  keyPath: keyof Item;
}

export type InitialChange<Value = any> = {
  type: 'initial';
  initial: Value;
  meta: QueryMeta;
  queryInfo: QueryInfo<any>;
};

export type Change<KeyValue, Result> =
  | InitialChange<Result>
  | { type: 'inserted'; result: Result }
  | { type: 'updated'; result: Result }
  | { type: 'deleted'; keys: Array<KeyValue> };

export type Changes<KeyValue, Result> = Array<Change<KeyValue, Result>>;

export interface QueryOptions<Model extends BaseModel> {
  criteria?: Criteria<Model>;
  sort?: Sort<Model>;
  limit?: number;
  skip?: number;
}

export type ResourceOperationKey =
  | 'fetch'
  | 'subscribe'
  | 'fetchAndSubscribe'
  | 'unsubscribe'
  | 'cursor'
  | 'cursor toArray'
  | 'do';

type Transformer<Model extends BaseModel, Transformed = Model> = (
  model: Model,
) => Transformed;
