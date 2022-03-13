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
  $currentDate?: { [P in Join<NestedPaths<Model>, '.'>]?: $CurrentDateSpec };
  $inc?: { [P in Join<NestedPaths<Model>, '.'>]?: number };
  $min?: { [P in Join<NestedPaths<Model>, '.'>]?: number };
  $max?: { [P in Join<NestedPaths<Model>, '.'>]?: number };
  $mul?: { [P in Join<NestedPaths<Model>, '.'>]?: number };
  $rename?: { [P in Join<NestedPaths<Model>, '.'>]?: string };
  $set?: Partial<Model> & {
    [P in Join<NestedPaths<Model>, '.'>]?: PropertyType<Model, P>;
  };
  $setOnInsert?: Partial<Model> & {
    [P in Join<NestedPaths<Model>, '.'>]?: PropertyType<Model, P>;
  };
  $unset?: { [P in Join<NestedPaths<Model>, '.'>]?: '' | true | 1 };

  /* Array Update Operators */
  // Model[P] is Array ? never :
  $addToSet?: { [P in Join<NestedPaths<Model>, '.'>]?: any };
  $pop?: { [P in Join<NestedPaths<Model>, '.'>]?: 1 | -1 };
  $pull?: { [P in Join<NestedPaths<Model>, '.'> | keyof Model]?: any };
  /** The $push operator appends a specified value to an array. */
  $push?: { [P in Join<NestedPaths<Model>, '.'> | keyof Model]?: any };
  $pullAll?: { [P in Join<NestedPaths<Model>, '.'>]?: Array<any> };
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

type Join<T extends unknown[], D extends string> = T extends []
  ? ''
  : T extends [string | number]
  ? `${T[0]}`
  : T extends [string | number, ...infer R]
  ? `${T[0]}${D}${Join<R, D>}`
  : string;
type NestedPaths<Type> = Type extends
  | string
  | number
  | boolean
  | Date
  | RegExp
  | Buffer
  | Uint8Array
  | ((...args: any[]) => any)
  | {
      _bsontype: string;
    }
  ? []
  : Type extends ReadonlyArray<infer ArrayType>
  ? [number, ...NestedPaths<ArrayType>]
  : Type extends Map<string, any>
  ? [string]
  : Type extends object
  ? {
      [Key in Extract<keyof Type, string>]: Type[Key] extends Type
        ? [Key]
        : Type extends Type[Key]
        ? [Key]
        : Type[Key] extends ReadonlyArray<infer ArrayType>
        ? Type extends ArrayType
          ? [Key]
          : ArrayType extends Type
          ? [Key]
          : [Key, ...NestedPaths<Type[Key]>]
        : [Key, ...NestedPaths<Type[Key]>];
    }[Extract<keyof Type, string>]
  : [];

type PropertyType<Type, Property extends string> = string extends Property
  ? unknown
  : Property extends keyof Type
  ? Type[Property]
  : Property extends `${number}`
  ? Type extends ReadonlyArray<infer ArrayType>
    ? ArrayType
    : unknown
  : Property extends `${infer Key}.${infer Rest}`
  ? Key extends `${number}`
    ? Type extends ReadonlyArray<infer ArrayType>
      ? PropertyType<ArrayType, Rest>
      : unknown
    : Key extends keyof Type
    ? Type[Key] extends Map<string, infer MapType>
      ? MapType
      : PropertyType<Type[Key], Rest>
    : unknown
  : unknown;

export type Criteria<Model extends BaseModel> = { [P in keyof Model]?: any } & {
  [Property in Join<NestedPaths<Model>, '.'>]?: Condition<
    PropertyType<Model, Property>
  >;
} & {
  $and?: Criteria<TSchema>[];
  $nor?: Criteria<TSchema>[];
  $or?: Criteria<TSchema>[];
  $text?: {
    $search: string;
    $language?: string;
    $caseSensitive?: boolean;
    $diacriticSensitive?: boolean;
  };
  $where?: string | ((this: TSchema) => boolean);
  $comment?: string | Document;
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
