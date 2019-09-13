import { AbstractStoreCursor } from 'liwi-store';
import { BaseModel } from 'liwi-types';
import CursorResource from './CursorResource';
export default class ResourceServerCursor<Model extends BaseModel, Transformed = any, ConnectedUser = any> {
    private readonly resource;
    private readonly connectedUser?;
    private readonly cursor;
    constructor(resource: CursorResource<Model, Transformed, ConnectedUser>, cursor: AbstractStoreCursor<Model, any, any, Model>, connectedUser?: ConnectedUser);
    toArray(): Promise<Transformed[]>;
}
//# sourceMappingURL=ResourceServerCursor.d.ts.map