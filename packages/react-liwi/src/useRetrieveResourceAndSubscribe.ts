/* eslint-disable max-lines */
import { Query, QueryParams, QuerySubscription } from 'liwi-resources-client';
import { Changes, InitialChange, QueryInfo, QueryMeta } from 'liwi-types';
import Logger from 'nightingale-logger';
import { useEffect, useReducer, useRef, useMemo } from 'react';
import { ApplyChanges } from './applyChanges/ApplyChanges';
import { applyCollectionChanges } from './applyChanges/applyCollectionChanges';
import { applySingleItemChanges } from './applyChanges/applySingleItemChanges';
import {
  createResourceResultFromState,
  ResourceResult,
} from './createResourceResultFromState';
import reducer, {
  ResourceReducer,
  ResourceReducerInitializerReturn,
  initReducer,
} from './reducer';

export interface UseResourceAndSubscribeOptions {
  visibleTimeout: number;
}

const defaultOptions = {
  visibleTimeout: 1000 * 60 * 2, // 2 minutes
};

const logger = new Logger('react-liwi:useResourceAndSubscribe');

const isInitial = <Result>(
  changes: Changes<any, Result>,
): changes is [InitialChange<Result>] =>
  changes.length === 1 && changes[0].type === 'initial';

export function useRetrieveResourceAndSubscribe<
  Result,
  Params extends QueryParams<Params> | undefined
>(
  createQuery: (initialParams: Params) => Query<Result, Params>,
  params: Params,
  deps: any[],
  { visibleTimeout }: UseResourceAndSubscribeOptions = defaultOptions,
): ResourceResult<Result, Params> {
  const querySubscriptionRef = useRef<QuerySubscription | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const changeParamsRef = useRef<((parans: Params) => void) | undefined>(
    undefined,
  );

  const handleVisibilityChangeRef = useRef<any>(undefined);

  const unsubscribe = (): void => {
    logger.info('unsubscribe');

    // reset timeout to allow resubscribing
    timeoutRef.current = undefined;

    if (querySubscriptionRef.current) {
      querySubscriptionRef.current.stop();
      querySubscriptionRef.current = undefined;
    }
  };

  const [state, dispatch] = useReducer<
    ResourceReducer<Result, Params>,
    () => ResourceReducerInitializerReturn<Result, Params>
  >(
    reducer,
    () => {
      const query = createQuery(params);
      let applyChanges: ApplyChanges<Result, any>;

      let currentResult: Result | undefined;
      let currentMeta: QueryMeta | undefined;
      let currentQueryInfo: QueryInfo<any> | undefined;

      return {
        query,
        promise: new Promise((resolve, reject) => {
          const queryLogger = logger.context({
            resourceName: (query as any).resourceName,
            key: (query as any).key,
          });
          queryLogger.debug('init');

          const subscribe = (): void => {
            queryLogger.debug('subscribing', {
              querySubscriptionRef: querySubscriptionRef.current,
              timeoutRef: timeoutRef.current,
            });
            querySubscriptionRef.current = query.fetchAndSubscribe(
              (err: Error | null, changes: Changes<any, Result>) => {
                queryLogger.debug('received changes', {
                  err,
                  changes,
                });

                if (err) {
                  dispatch({ type: 'error', error: err });
                  return;
                }

                if (!currentResult && isInitial(changes)) {
                  const initialChange: InitialChange = changes[0];
                  currentResult = initialChange.initial;
                  currentMeta = initialChange.meta;
                  currentQueryInfo = initialChange.queryInfo;
                  dispatch({
                    type: 'resolve',
                    result: initialChange.initial,
                    meta: initialChange.meta,
                    queryInfo: currentQueryInfo,
                  });
                  applyChanges = (Array.isArray(initialChange.initial)
                    ? applyCollectionChanges
                    : applySingleItemChanges) as ApplyChanges<Result, any>;
                } else {
                  const { state: newResult, meta: newMeta } = applyChanges(
                    currentResult,
                    changes,
                    currentMeta as NonNullable<typeof currentMeta>,
                    currentQueryInfo as NonNullable<typeof currentQueryInfo>,
                  );

                  if (newResult && newResult !== currentResult) {
                    currentResult = newResult;
                    currentMeta = newMeta;
                    dispatch({
                      type: 'resolve',
                      result: newResult,
                      meta: newMeta,
                      queryInfo: currentQueryInfo as NonNullable<
                        typeof currentQueryInfo
                      >,
                    });
                  }
                }
              },
            );
            querySubscriptionRef.current.then(
              () => {
                queryLogger.success('subscribed');
              },
              (error) => {
                dispatch({
                  type: 'error',
                  error,
                });
              },
            );
          };

          changeParamsRef.current = (params: Params) => {
            queryLogger.info('change params', { params });
            if (querySubscriptionRef.current) {
              querySubscriptionRef.current.stop();
            }

            query.changeParams(params);

            if (!document.hidden) {
              dispatch({
                type: 'fetching',
              });
              subscribe();
            }
          };

          const handleVisibilityChange = (): void => {
            if (!document.hidden) {
              if (timeoutRef.current !== undefined) {
                queryLogger.debug('timeout cleared');
                clearTimeout(timeoutRef.current);
                timeoutRef.current = undefined;
              } else if (!querySubscriptionRef.current) {
                queryLogger.info('resubscribe');
                dispatch({
                  type: 'fetching',
                });
                subscribe();
              }
              return;
            }

            if (querySubscriptionRef.current === undefined) return;

            queryLogger.debug('timeout visible');
            timeoutRef.current = setTimeout(unsubscribe, visibleTimeout);
          };

          handleVisibilityChangeRef.current = handleVisibilityChange;

          document.addEventListener(
            'visibilitychange',
            handleVisibilityChange,
            false,
          );

          if (!document.hidden) {
            subscribe();
          }
        }),
      };
    },
    initReducer,
  );

  const firstEffectChangeParams = useRef(false);

  useEffect(() => {
    if (firstEffectChangeParams.current === false) {
      firstEffectChangeParams.current = true;
      return;
    }

    if (changeParamsRef.current) {
      console.log('call changeparams', params);
      changeParamsRef.current(params);
    } else {
      console.log('changeParamsRef.current is undefined');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    return () => {
      if (handleVisibilityChangeRef.current) {
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChangeRef.current,
        );
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }

      unsubscribe();
    };
  }, []);

  return useMemo(() => createResourceResultFromState(state), [state]);
}
