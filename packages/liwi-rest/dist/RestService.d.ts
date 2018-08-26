import { Criteria, Sort } from 'liwi-types';
import RestCursor from './RestCursor';
export interface CreateCursorOptions<Model> {
    criteria?: Criteria<Model>;
    sort?: Sort<Model>;
    limit?: number;
}
export default class RestService {
    restResources: Map<string, any>;
    constructor(restResources: Map<string, any>);
    addRestResource(key: string, restResource: any): void;
    get(key: string): any;
    createCursor<Model, R extends any>(restResource: R, connectedUser: any, { criteria, sort, limit }: CreateCursorOptions<Model>): Promise<RestCursor<R>>;
}
//# sourceMappingURL=RestService.d.ts.map