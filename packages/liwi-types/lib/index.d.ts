export interface BaseModel {
  created: Date;
  updated: Date;
  [key: string]: any;
}

export type InsertType<T extends BaseModel, IdKey extends string>
  = Pick<T, Exclude<keyof T, IdKey | 'created' | 'updated'>> & Partial<Pick<T, IdKey | 'created' | 'updated'>>;

// export type InsertedType<T extends BaseModel> = T;

// export type UpdateType<T extends BaseModel> = T;

// export type UpdatedType<T extends BaseModel> = Pick<T, Exclude<keyof T, 'updated'>> &
// Required<Pick<T, 'updated'>>;

export type $CurrentDateSpec = true | { $type: "timestamp" } | { $type: "date" };

export interface Update<Model extends BaseModel> {
  /* Field Update Operators */
  $currentDate?: { [P in keyof Model]?: $CurrentDateSpec } & { [field: string]: $CurrentDateSpec },
  $inc?: { [P in keyof Model]?: number } & { [field: string]: number },
  $min?: { [P in keyof Model]?: number } & { [field: string]: number },
  $max?: { [P in keyof Model]?: number } & { [field: string]: number },
  $mul?: { [P in keyof Model]?: number } & { [field: string]: number },
  $rename?: { [P in keyof Model]?: string } & { [field: string]: string },
  $set?: Partial<Model> & { [field: string]: any },
  $setOnInsert?: Partial<Model> & { [field: string]: any },
  $unset?: { [P in keyof Model]?: any } & { [field: string]: any },

  /* Array Update Operators */
  // Model[P] is Array ? never :
  $addToSet?: { [P in keyof Model]?: any } & { [field: string]: any },
  $pop?: { [P in keyof Model]?: 1 | -1 } & { [field: string]: 1 | -1 },
  $pull?: { [P in keyof Model]?: any } & { [field: string]: any },
  /** The $push operator appends a specified value to an array. */
  $push?: { [P in keyof Model]?: any } & { [field: string]: any },
  $pullAll?: { [P in keyof Model]?: Array<any> } & { [field: string]: Array<any> },
}

export type Fields<Model extends BaseModel> = { [P in keyof Model]?: 0 | 1 } & { [key: string]: 0 | 1; }

export type Criteria<Model extends BaseModel> = { [P in keyof Model]?: any } & { [key: string]: any }

export type Sort<Model extends BaseModel> = { [P in keyof Model]?: -1 | 1 } & { [key: string]: -1 | 1; }

export interface QueryInfo {
  limit?: number;
  keyPath: string;
}

export type InitialChange<Value = any> = { type: 'initial'; initial: Array<Value>, queryInfo?: QueryInfo };

export type Change<Value = any> =
  | InitialChange<Value>
  | { type: 'inserted'; objects: Array<Value> }
  | { type: 'updated'; objects: Array<Value> }
  | { type: 'deleted'; keys: Array<string> };

export type Changes<Value> = Array<Change<Value>>;

export interface QueryOptions<Model extends BaseModel> {
  criteria?: Criteria<Model>;
  sort?: Sort<Model>;
  limit?: number;
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
