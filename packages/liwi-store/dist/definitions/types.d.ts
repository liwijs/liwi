/// <reference types="node" />
export type Except<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SetOptional<T, K extends keyof T> = Except<T, K> & Partial<Pick<T, K>>;
export interface BaseModel {
    created: Date;
    updated: Date;
}
export type OptionalBaseModelKeysForInsert = keyof BaseModel;
export type AllowedKeyValue = string | number;
export type InsertType<Model extends BaseModel & Record<KeyPath, unknown>, KeyPath extends keyof Model> = SetOptional<Model, KeyPath | OptionalBaseModelKeysForInsert>;
export type $CurrentDateSpec = true | {
    $type: 'timestamp';
} | {
    $type: 'date';
};
export interface Update<Model extends BaseModel> {
    $currentDate?: {
        [P in Join<NestedPaths<Model>, '.'>]?: $CurrentDateSpec;
    };
    $inc?: {
        [P in Join<NestedPaths<Model>, '.'>]?: number;
    };
    $min?: {
        [P in Join<NestedPaths<Model>, '.'>]?: number;
    };
    $max?: {
        [P in Join<NestedPaths<Model>, '.'>]?: number;
    };
    $mul?: {
        [P in Join<NestedPaths<Model>, '.'>]?: number;
    };
    $rename?: {
        [P in Join<NestedPaths<Model>, '.'>]?: string;
    };
    $set?: Partial<Model> & {
        [P in Join<NestedPaths<Model>, '.'>]?: PropertyType<Model, P>;
    };
    $setOnInsert?: Partial<Model> & {
        [P in Join<NestedPaths<Model>, '.'>]?: PropertyType<Model, P>;
    };
    $unset?: {
        [P in Join<NestedPaths<Model>, '.'>]?: '' | true | 1;
    };
    $addToSet?: {
        [P in Join<NestedPaths<Model>, '.'>]?: any;
    };
    $pop?: {
        [P in Join<NestedPaths<Model>, '.'>]?: 1 | -1;
    };
    $pull?: {
        [P in Join<NestedPaths<Model>, '.'> | keyof Model]?: any;
    };
    /** The $push operator appends a specified value to an array. */
    $push?: {
        [P in Join<NestedPaths<Model>, '.'> | keyof Model]?: any;
    };
    $pullAll?: {
        [P in Join<NestedPaths<Model>, '.'>]?: any[];
    };
}
export type ExcludeOnlyFields<Model extends BaseModel> = {
    [P in keyof Model]?: 0;
} & Record<string, 0>;
export type IncludeOnlyFields<Model extends BaseModel> = {
    [P in keyof Model]?: 1;
} & Record<string, 1>;
export type Fields<Model extends BaseModel> = ExcludeOnlyFields<Model> | IncludeOnlyFields<Model>;
type BitwiseFilter = number /** numeric bit mask */ | readonly number[];
interface FilterOperators<TValue> {
    $eq?: TValue;
    $gt?: TValue;
    $gte?: TValue;
    $in?: readonly TValue[];
    $lt?: TValue;
    $lte?: TValue;
    $ne?: TValue;
    $nin?: readonly TValue[];
    $not?: TValue extends string ? FilterOperators<TValue> | RegExp : FilterOperators<TValue>;
    /**
     * When `true`, `$exists` matches the documents that contain the field,
     * including documents where the field value is null.
     */
    $exists?: boolean;
    $expr?: Record<string, any>;
    $jsonSchema?: Record<string, any>;
    $mod?: TValue extends number ? [number, number] : never;
    $regex?: TValue extends string ? RegExp | string : never;
    $options?: TValue extends string ? string : never;
    $geoIntersects?: {
        $geometry: Document;
    };
    $geoWithin?: Document;
    $near?: Document;
    $nearSphere?: Document;
    $maxDistance?: number;
    $all?: readonly any[];
    $elemMatch?: Document;
    $size?: TValue extends readonly any[] ? number : never;
    $bitsAllClear?: BitwiseFilter;
    $bitsAllSet?: BitwiseFilter;
    $bitsAnyClear?: BitwiseFilter;
    $bitsAnySet?: BitwiseFilter;
    $rand?: Record<string, never>;
}
type Join<T extends unknown[], D extends string> = T extends [] ? '' : T extends [string | number] ? `${T[0]}` : T extends [string | number, ...infer R] ? `${T[0]}${D}${Join<R, D>}` : string;
type NestedPaths<Type> = Type extends string | number | boolean | Date | RegExp | Buffer | Uint8Array | ((...args: any[]) => any) | {
    _bsontype: string;
} ? [] : Type extends readonly (infer ArrayType)[] ? [number, ...NestedPaths<ArrayType>] : Type extends Map<string, any> ? [string] : Type extends object ? {
    [Key in Extract<keyof Type, string>]: Type[Key] extends Type ? [Key] : Type extends Type[Key] ? [Key] : Type[Key] extends readonly (infer ArrayType)[] ? Type extends ArrayType ? [Key] : ArrayType extends Type ? [Key] : [Key, ...NestedPaths<Type[Key]>] : [Key, ...NestedPaths<Type[Key]>];
}[Extract<keyof Type, string>] : [];
type PropertyType<Type, Property extends string> = string extends Property ? unknown : Property extends keyof Type ? Type[Property] : Property extends `${number}` ? Type extends readonly (infer ArrayType)[] ? ArrayType : unknown : Property extends `${infer Key}.${infer Rest}` ? Key extends `${number}` ? Type extends readonly (infer ArrayType)[] ? PropertyType<ArrayType, Rest> : unknown : Key extends keyof Type ? Type[Key] extends Map<string, infer MapType> ? MapType : PropertyType<Type[Key], Rest> : unknown : unknown;
type RegExpOrString<T> = T extends string ? RegExp | T : T;
type AlternativeType<T> = T extends readonly (infer U)[] ? T | RegExpOrString<U> : RegExpOrString<T>;
type Condition<T> = AlternativeType<T> | FilterOperators<AlternativeType<T>>;
export type Criteria<Model extends BaseModel> = {
    [P in keyof Model]?: any;
} & {
    [Property in Join<NestedPaths<Model>, '.'>]?: Condition<PropertyType<Model, Property>>;
} & {
    $and?: Criteria<Model>[];
    $nor?: Criteria<Model>[];
    $or?: Criteria<Model>[];
    $text?: {
        $search: string;
        $language?: string;
        $caseSensitive?: boolean;
        $diacriticSensitive?: boolean;
    };
    $where?: string | ((this: Model) => boolean);
    $comment?: string | Document;
    [key: string]: any;
};
export type Sort<Model extends BaseModel> = {
    [P in keyof Model]?: -1 | 1;
} & Record<string, -1 | 1>;
export interface QueryMeta {
    total: number;
}
export interface QueryInfo<Item extends Record<keyof Item, unknown>> {
    limit?: number;
    sort?: Sort<any>;
    keyPath: keyof Item;
}
export interface InitialChange<Value = any> {
    type: 'initial';
    initial: Value;
    meta: QueryMeta;
    queryInfo: QueryInfo<any>;
}
export type Change<KeyValue, Result> = InitialChange<Result> | {
    type: 'inserted';
    result: Result;
} | {
    type: 'updated';
    result: Result;
} | {
    type: 'deleted';
    keys: KeyValue[];
};
export type Changes<KeyValue, Result> = Change<KeyValue, Result>[];
export interface QueryOptions<Model extends BaseModel> {
    criteria?: Criteria<Model>;
    sort?: Sort<Model>;
    limit?: number;
    skip?: number;
}
export type ResourceOperationKey = 'fetch' | 'subscribe' | 'fetchAndSubscribe' | 'unsubscribe' | 'cursor' | 'cursor toArray' | 'do';
export type Transformer<Model extends BaseModel, Transformed = Model> = (model: Model) => Transformed;
export {};
//# sourceMappingURL=types.d.ts.map