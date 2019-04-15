import { AbstractQuery } from 'liwi-store';
import { BaseModel } from 'liwi-types';
declare type CreateQuery<M extends BaseModel> = () => AbstractQuery<M>;
declare type UseResourceResult<Results> = [true, []] | [false, Results];
export default function useResources<T1 extends BaseModel>(createQueries: [CreateQuery<T1>], queriesToSubscribe: [boolean]): UseResourceResult<[T1[]]>;
export default function useResources<T1 extends BaseModel, T2 extends BaseModel>(createQueries: [CreateQuery<T1>, CreateQuery<T2>], queriesToSubscribe: [boolean, boolean]): UseResourceResult<[T1[], T2[]]>;
export default function useResources<T1 extends BaseModel, T2 extends BaseModel, T3 extends BaseModel>(createQueries: [CreateQuery<T1>, CreateQuery<T2>, CreateQuery<T3>], queriesToSubscribe: [boolean, boolean, boolean]): UseResourceResult<[T1[], T2[], T3[]]>;
export default function useResources<T1 extends BaseModel, T2 extends BaseModel, T3 extends BaseModel, T4 extends BaseModel>(createQueries: [CreateQuery<T1>, CreateQuery<T2>, CreateQuery<T3>, CreateQuery<T4>], queriesToSubscribe: [boolean, boolean, boolean, boolean]): UseResourceResult<[T1[], T2[], T3[], T4[]]>;
export default function useResources<T1 extends BaseModel, T2 extends BaseModel, T3 extends BaseModel, T4 extends BaseModel, T5 extends BaseModel>(createQueries: [CreateQuery<T1>, CreateQuery<T2>, CreateQuery<T3>, CreateQuery<T4>, CreateQuery<T5>], queriesToSubscribe: [boolean, boolean, boolean, boolean, boolean]): UseResourceResult<[T1[], T2[], T3[], T4[], T5[]]>;
export {};
//# sourceMappingURL=useResources.d.ts.map