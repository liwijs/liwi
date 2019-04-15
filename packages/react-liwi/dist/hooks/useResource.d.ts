import { AbstractQuery } from 'liwi-store';
import { BaseModel } from 'liwi-types';
declare type UseResourceResult<Result> = [true, undefined] | [false, Result];
export default function useResource<Model extends BaseModel>(createQuery: () => AbstractQuery<Model>, subscribe: boolean): UseResourceResult<Model[]>;
export {};
//# sourceMappingURL=useResource.d.ts.map