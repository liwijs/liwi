import { useReducer } from 'react';
import { BaseModel } from 'liwi-types';
import { AbstractQuery } from 'liwi-store';
import reducer, { initReducer, ResourceReducer, State } from '../reducer';

export default function useRetrieveResource<Model extends BaseModel>(
  createQuery: () => AbstractQuery<Model>,
): State<Model[]> {
  const [state, dispatch] = useReducer<
    ResourceReducer<Model[]>,
    () => Promise<void>
  >(
    reducer,
    () =>
      createQuery().fetch((result: Model[]) => {
        dispatch({ type: 'resolve', result });
      }),
    initReducer,
  );

  return state;
}
