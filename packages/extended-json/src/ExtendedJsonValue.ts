export type ExtendedJsonValue =
  | Date
  | ExtendedJsonRecord
  | ExtendedJsonValue[]
  | boolean
  | number
  | string
  | null
  | undefined;

export interface ExtendedJsonRecord {
  [key: string]: ExtendedJsonValue;
}
