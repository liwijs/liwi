import { useReducer } from 'react';
import { BaseModel } from 'liwi-types';
import { AbstractQuery } from 'liwi-store';
import reducer, { initReducer, Reducer } from '../reducer';

export default function useRetrieveResource<Model extends BaseModel>(
  createQuery: () => AbstractQuery<Model>,
) {
  const [state, dispatch] = useReducer<Reducer<Model[]>, () => Promise<void>>(
    reducer,
    () =>
      createQuery().fetch((result: Model[]) => {
        (state as any).resolve();
        dispatch({ type: 'resolve', result });
      }),
    initReducer,
  );

  return state;
}
