import { BaseModel } from 'liwi-types';
import ClientQuery from './ClientQuery';
export { default as AbstractClient } from './AbstractClient';
export declare type ResourcesClientService<Queries extends string, Model extends BaseModel, KeyPath extends string = '_id'> = Record<Queries, ClientQuery<Model, KeyPath>>;
//# sourceMappingURL=index.d.ts.map