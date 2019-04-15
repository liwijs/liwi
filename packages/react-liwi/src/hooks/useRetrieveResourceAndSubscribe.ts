import { useEffect, useReducer, useRef } from 'react';
import { BaseModel, Changes } from 'liwi-types';
import { AbstractQuery, SubscribeResult } from 'liwi-store';
import Logger from 'nightingale-logger';
import applyChanges from '../applyChanges';
import reducer, { Reducer, initReducer } from '../reducer';

interface UseResourceAndSubscribeOptions {
  visibleTimeout: number;
}

const defaultOptions = {
  visibleTimeout: 1000 * 60 * 2, // 2 minutes
};

const logger = new Logger('react-liwi:useResourceAndSubscribe');

export default function useRetrieveResourceAndSubscribe<
  Model extends BaseModel
>(
  createQuery: () => AbstractQuery<Model>,
  { visibleTimeout }: UseResourceAndSubscribeOptions = defaultOptions,
) {
  const subscribeResultRef = useRef<SubscribeResult<Model[]> | undefined>(
    undefined,
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const unsubscribe = (): void => {
    logger.log('unsubscribe');

    // reset timeout to allow resubscribing
    timeoutRef.current = undefined;

    if (subscribeResultRef.current) {
      subscribeResultRef.current.stop();
      subscribeResultRef.current = undefined;
    }
  };

  const [state, dispatch] = useReducer<Reducer<Model[]>, () => Promise<void>>(
    reducer,
    () =>
      new Promise((resolve, reject) => {
        const query = createQuery();
        logger.debug('init', {
          resourceName: (query as any).client.resourceName,
          key: (query as any).key,
        });

        const subscribe = (): void => {
          logger.log('subscribing', {
            subscribeResultRef: subscribeResultRef.current,
            timeoutRef: timeoutRef.current,
          });
          subscribeResultRef.current = query.fetchAndSubscribe(
            (err: Error | null, changes: Changes<Model>) => {
              if (err) {
                // eslint-disable-next-line no-alert
                alert(`Unexpected error: ${err}`);
                return;
              }

              const newResult = applyChanges(
                state.fetched ? state.result : undefined,
                changes,
                '_id', // TODO get keyPath from client(/store)
              );

              if (newResult && (!state.fetched || newResult !== state.result)) {
                dispatch({ type: 'resolve', result: newResult });
              }
            },
          );
        };

        const handleVisibilityChange = () => {
          if (!document.hidden) {
            if (timeoutRef.current !== undefined) {
              logger.info('timeout cleared');
              clearTimeout(timeoutRef.current);
              timeoutRef.current = undefined;
            } else if (!subscribeResultRef.current) {
              logger.info('resubscribe');
              subscribe();
            }
            return;
          }

          if (subscribeResultRef.current === undefined) return;

          logger.log('timeout visible');
          timeoutRef.current = setTimeout(unsubscribe, visibleTimeout);
        };

        document.addEventListener(
          'visibilitychange',
          handleVisibilityChange,
          false,
        );

        if (!document.hidden) {
          subscribe();
        }
      }),
    initReducer,
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }

      unsubscribe();
    };
  }, []);

  return state;
}
