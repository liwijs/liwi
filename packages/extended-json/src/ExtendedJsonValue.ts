export type ExtendedJsonValue =
  | undefined
  | null
  | string
  | number
  | boolean
  | Date
  | ExtendedJsonValue[]
  | ExtendedJsonRecord;

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface ExtendedJsonRecord {
  [key: string]: ExtendedJsonValue;
}
