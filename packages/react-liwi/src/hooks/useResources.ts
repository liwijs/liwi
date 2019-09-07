/* eslint-disable import/export */

import { POB_TARGET } from 'pob-babel';
import { AbstractQuery } from 'liwi-store';
import { BaseModel } from 'liwi-types';
import { InitialState, FetchedState } from '../reducer';
import useRetrieveResource from './useRetrieveResource';
import useRetrieveResourceAndSubscribe from './useRetrieveResourceAndSubscribe';

type CreateQuery<M extends BaseModel> = () => AbstractQuery<M>;
type UseResourceResult<Results> = [true, []] | [false, Results];

export default function useResources<T1 extends BaseModel>(
  createQueries: [CreateQuery<T1>],
  queriesToSubscribe: [boolean],
): UseResourceResult<[T1[]]>;
export default function useResources<
  T1 extends BaseModel,
  T2 extends BaseModel
>(
  createQueries: [CreateQuery<T1>, CreateQuery<T2>],
  queriesToSubscribe: [boolean, boolean],
): UseResourceResult<[T1[], T2[]]>;
export default function useResources<
  T1 extends BaseModel,
  T2 extends BaseModel,
  T3 extends BaseModel
>(
  createQueries: [CreateQuery<T1>, CreateQuery<T2>, CreateQuery<T3>],
  queriesToSubscribe: [boolean, boolean, boolean],
): UseResourceResult<[T1[], T2[], T3[]]>;
export default function useResources<
  T1 extends BaseModel,
  T2 extends BaseModel,
  T3 extends BaseModel,
  T4 extends BaseModel
>(
  createQueries: [
    CreateQuery<T1>,
    CreateQuery<T2>,
    CreateQuery<T3>,
    CreateQuery<T4>,
  ],
  queriesToSubscribe: [boolean, boolean, boolean, boolean],
): UseResourceResult<[T1[], T2[], T3[], T4[]]>;
export default function useResources<
  T1 extends BaseModel,
  T2 extends BaseModel,
  T3 extends BaseModel,
  T4 extends BaseModel,
  T5 extends BaseModel
>(
  createQueries: [
    CreateQuery<T1>,
    CreateQuery<T2>,
    CreateQuery<T3>,
    CreateQuery<T4>,
    CreateQuery<T5>,
  ],
  queriesToSubscribe: [boolean, boolean, boolean, boolean, boolean],
): UseResourceResult<[T1[], T2[], T3[], T4[], T5[]]>;
export default function useResources<T extends BaseModel>(
  createQueries: (CreateQuery<T>)[],
  queriesToSubscribe: boolean[],
): UseResourceResult<T[][]> {
  if (POB_TARGET === 'node') return [true, []];

  const states = createQueries.map((createQuery, index) => {
    return queriesToSubscribe[index]
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useRetrieveResourceAndSubscribe(createQuery)
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useRetrieveResource(createQuery);
  });

  const nonFetchedStates: InitialState[] = states.filter(
    (state) => !state.fetched,
  ) as InitialState[];

  if (nonFetchedStates.length !== 0) {
    return [true, []];
  }

  return [false, states.map((state) => (state as FetchedState<any>).result)];
}
