import { AbstractCursor } from 'liwi-store';
import { BaseModel } from 'liwi-types';
import Resource from './Resource';
export default class ResourceCursor<Model extends BaseModel, Transformed = any, ConnectedUser = any> {
    private resource;
    private connectedUser;
    private cursor;
    constructor(resource: Resource<Model, Transformed, ConnectedUser>, cursor: AbstractCursor<Model, any, any>, connectedUser?: ConnectedUser);
    toArray(): Promise<Array<Transformed>>;
}
//# sourceMappingURL=ResourceCursor.d.ts.map