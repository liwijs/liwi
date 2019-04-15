import { POB_TARGET } from 'pob-babel';
import { AbstractQuery } from 'liwi-store';
import { BaseModel } from 'liwi-types';
import useRetrieveResource from './useRetrieveResource';
import useRetrieveResourceAndSubscribe from './useRetrieveResourceAndSubscribe';

type UseResourceResult<Result> = [true, undefined] | [false, Result];

export default function useResource<Model extends BaseModel>(
  createQuery: () => AbstractQuery<Model>,
  subscribe: boolean,
): UseResourceResult<Model[]> {
  if (POB_TARGET === 'node') return [true, undefined];

  const state = subscribe
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useRetrieveResourceAndSubscribe(createQuery)
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useRetrieveResource(createQuery);

  if (!state.fetched) {
    return [true, undefined];
  }

  return [false, state.result];
}
