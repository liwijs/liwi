import { AbstractStoreCursor } from 'liwi-store';
import { BaseModel } from 'liwi-types';
import Resource from './Resource';
export default class ResourceServerCursor<Model extends BaseModel, Transformed = any, ConnectedUser = any> {
    private resource;
    private connectedUser;
    private cursor;
    constructor(resource: Resource<Model, any, any, Transformed, ConnectedUser>, cursor: AbstractStoreCursor<Model, any, any>, connectedUser?: ConnectedUser);
    toArray(): Promise<Transformed[]>;
}
//# sourceMappingURL=ResourceServerCursor.d.ts.map