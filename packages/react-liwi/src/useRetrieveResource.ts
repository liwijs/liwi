import type { Query, QueryParams, QueryResult } from 'liwi-resources-client';
import { useReducer, useEffect, useRef, useContext, useCallback } from 'react';
import { TransportClientReadyContext } from './TransportClientProvider';
import type { ResourceResult } from './createResourceResultFromState';
import { createResourceResultFromState } from './createResourceResultFromState';
import type {
  ResourceReducer,
  ResourceReducerInitializerReturn,
} from './reducer';
import reducer, { initReducer } from './reducer';

export function useRetrieveResource<Result, Params extends QueryParams<Params>>(
  createQuery: (initialParams: Params) => Query<Result, Params>,
  params: Params,
  skip: boolean,
  deps: any[],
): ResourceResult<Result, Params> {
  const isTransportReady = useContext(TransportClientReadyContext);
  const wasReady = useRef(isTransportReady);
  const currentFetchId = useRef(0);

  const fetch = useCallback(
    (
      query: Query<Result, Params>,
      callback: (result: QueryResult<Result>) => void,
    ): Promise<void> => {
      const fetchId = ++currentFetchId.current;
      return query.fetch((result): void => {
        if (currentFetchId.current === fetchId) {
          callback(result);
        }
      });
    },
    [],
  );

  const [state, dispatch] = useReducer<
    ResourceReducer<Result, Params>,
    () => ResourceReducerInitializerReturn<Result, Params>
  >(
    reducer,
    () => {
      const query = createQuery(params);

      if (!isTransportReady || skip) return { query };

      return {
        query,
        promise: fetch(query, ({ result, meta, info }) => {
          dispatch({ type: 'resolve', result, meta, queryInfo: info });
        }).catch((err) => {
          dispatch({ type: 'error', error: err });
        }),
      };
    },
    initReducer,
  );

  useEffect(() => {
    if (wasReady.current) return;
    if (!isTransportReady) return;
    if (skip) return;
    wasReady.current = true;

    dispatch({
      type: 'refetch',
      promise: fetch(state.query, ({ result, meta, info }) => {
        dispatch({ type: 'resolve', result, meta, queryInfo: info });
      }).catch((err) => {
        dispatch({ type: 'error', error: err });
      }),
    });
  }, [isTransportReady, fetch, skip, state.query]);

  const firstEffectChangeParams = useRef(false);

  useEffect(() => {
    if (firstEffectChangeParams.current === false) {
      firstEffectChangeParams.current = true;
      return;
    }

    if (skip) {
      return;
    }

    state.query.changeParams(params);

    if (!wasReady.current) return;
    dispatch({
      type: 'refetch',
      promise: fetch(state.query, ({ result, meta, info }) => {
        dispatch({ type: 'resolve', result, meta, queryInfo: info });
      }).catch((err) => {
        dispatch({ type: 'error', error: err });
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.query, skip, ...deps]);

  return createResourceResultFromState(state);
}
