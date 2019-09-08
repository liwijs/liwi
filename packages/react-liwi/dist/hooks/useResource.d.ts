import { AbstractQuery } from 'liwi-store';
import { BaseModel } from 'liwi-types';
import { UseResourceAndSubscribeOptions } from './useRetrieveResourceAndSubscribe';
declare type UseResourceResult<Result> = [true, undefined] | [false, Result];
export default function useResource<Model extends BaseModel>(createQuery: () => AbstractQuery<Model>, subscribe: boolean, subscribeOptions?: UseResourceAndSubscribeOptions): UseResourceResult<Model[]>;
export {};
//# sourceMappingURL=useResource.d.ts.map