export type ExtendedJsonValue =
  | Date
  | ExtendedJsonRecord
  | ExtendedJsonValue[]
  | boolean
  | number
  | string
  | null
  | undefined;

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface ExtendedJsonRecord {
  [key: string]: ExtendedJsonValue;
}
