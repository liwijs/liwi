
export interface BaseModel {
  created: Date;
  updated: Date;
  [key: string]: any;
}

export type InsertType<T extends BaseModel, IdKey> = Pick<T, Exclude<keyof T, IdKey | 'created' | 'updated'>>;
// & Partial<Pick<T, 'created' | 'updated'>>;

// export type InsertedType<T extends BaseModel> = T;

// export type UpdateType<T extends BaseModel> = T;

// export type UpdatedType<T extends BaseModel> = Pick<T, Exclude<keyof T, 'updated'>> &
// Required<Pick<T, 'updated'>>;

export type $CurrentDateSpec = true | { $type: "timestamp" } | { $type: "date" };

export interface Update<Model> {
  $currentDate: { [field: string]: $CurrentDateSpec },
  $inc: { [field: string]: number },
  $min: { [field: string]: number },
  $max: { [field: string]: number },
  $mul: { [field: string]: number },
  $rename: { [field: string]: string },
  $set: { [field: string]: any },
  $setOnInsert: { [field: string]: any },
  $unset: { [field: string]: any },
}

export interface Criteria<Model> {
  [key: string]: any
}

export interface Sort<Model> {
  [key: string]: any
}
