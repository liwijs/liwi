import { useReducer, useRef, useEffect } from 'react';
import Logger from 'nightingale-logger';

function initReducer(initializer) {
  return {
    fetched: false,
    promise: initializer()
  };
}
function reducer(state, action) {
  switch (action.type) {
    case 'resolve':
      return {
        fetched: true,
        result: action.result
      };

    default:
      throw new Error('Invalid action');
  }
}

function useRetrieveResource(createQuery) {
  const [state, dispatch] = useReducer(reducer, function () {
    return createQuery().fetch(function (result) {
      state.resolve();
      dispatch({
        type: 'resolve',
        result
      });
    });
  }, initReducer);
  return state;
}

/* eslint-disable camelcase, complexity */
const copy = function copy(state) {
  return state.slice();
};

const applyChange = function applyChange(state, change, queryInfo) {
  switch (change.type) {
    case 'initial':
      return change.initial;

    case 'inserted':
      {
        return [...change.objects, ...(!queryInfo.limit ? state : state.slice(0, -queryInfo.limit))];
      }

    case 'deleted':
      {
        const keyPath = queryInfo.keyPath;
        const deletedKeys = change.keys;
        return state.filter(function (value) {
          return !deletedKeys.includes(value[keyPath]);
        });
      }

    case 'updated':
      {
        const keyPath = queryInfo.keyPath;
        const newState = copy(state);
        change.objects.forEach(function (newObject) {
          const index = newState.findIndex(function (o) {
            return o[keyPath] === newObject[keyPath];
          });
          if (index === -1) return;
          newState[index] = newObject;
        });
        return newState;
      }

    default:
      throw new Error('Invalid type');
  }
}; // https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js


function applyChanges(state, changes, queryInfo) {
  if (state === undefined) return state;
  return changes.reduce(function (stateValue, change) {
    return applyChange(stateValue, change, queryInfo);
  }, state);
}

/* eslint-disable @typescript-eslint/no-misused-promises */
const defaultOptions = {
  visibleTimeout: 120000 // 2 minutes

};
const logger = new Logger('react-liwi:useResourceAndSubscribe');
function useRetrieveResourceAndSubscribe(createQuery, {
  visibleTimeout
} = defaultOptions) {
  const subscribeResultRef = useRef(undefined);
  const timeoutRef = useRef(undefined);
  const resultRef = useRef(undefined);
  const queryInfoRef = useRef(undefined);
  const handleVisibilityChangeRef = useRef(undefined);

  const unsubscribe = function unsubscribe() {
    logger.log('unsubscribe'); // reset timeout to allow resubscribing

    timeoutRef.current = undefined;
    resultRef.current = undefined;

    if (subscribeResultRef.current) {
      subscribeResultRef.current.stop();
      subscribeResultRef.current = undefined;
    }
  };

  const [state, dispatch] = useReducer(reducer, function () {
    return new Promise(function () {
      const query = createQuery();
      const queryLogger = logger.context({
        resourceName: query.client.resourceName,
        key: query.key
      });
      queryLogger.debug('init');

      const subscribe = function subscribe() {
        queryLogger.debug('subscribing', {
          subscribeResultRef: subscribeResultRef.current,
          timeoutRef: timeoutRef.current
        });
        subscribeResultRef.current = query.fetchAndSubscribe(function (err, changes) {
          queryLogger.debug('received changes', {
            err,
            changes
          });

          if (err) {
            // eslint-disable-next-line no-alert
            alert(`Unexpected error: ${err}`);
            return;
          }

          const currentResult = resultRef.current;

          if (!currentResult && changes.length === 1 && changes[0].type === 'initial') {
            const initialChange = changes[0];
            resultRef.current = initialChange.initial;
            queryInfoRef.current = initialChange.queryInfo || {
              limit: undefined,
              keyPath: '_id'
            };
            dispatch({
              type: 'resolve',
              result: initialChange.initial
            });
          } else {
            const newResult = applyChanges(currentResult, changes, queryInfoRef.current);

            if (newResult && newResult !== currentResult) {
              resultRef.current = newResult;
              dispatch({
                type: 'resolve',
                result: newResult
              });
            }
          }
        });
      };

      const handleVisibilityChange = function handleVisibilityChange() {
        if (!document.hidden) {
          if (timeoutRef.current !== undefined) {
            queryLogger.debug('timeout cleared');
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
          } else if (!subscribeResultRef.current) {
            queryLogger.info('resubscribe');
            subscribe();
          }

          return;
        }

        if (subscribeResultRef.current === undefined) return;
        queryLogger.debug('timeout visible');
        timeoutRef.current = setTimeout(unsubscribe, visibleTimeout);
      };

      handleVisibilityChangeRef.current = handleVisibilityChange;
      document.addEventListener('visibilitychange', handleVisibilityChange, false);

      if (!document.hidden) {
        subscribe();
      }
    });
  }, initReducer);
  useEffect(function () {
    return function () {
      if (handleVisibilityChangeRef.current) {
        document.removeEventListener('visibilitychange', handleVisibilityChangeRef.current);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }

      unsubscribe();
    };
  }, []);
  return state;
}

/* eslint-disable import/export */
function useResources(createQueries, queriesToSubscribe) {
  const states = createQueries.map(function (createQuery, index) {
    return queriesToSubscribe[index] ? // eslint-disable-next-line react-hooks/rules-of-hooks
    useRetrieveResourceAndSubscribe(createQuery) : // eslint-disable-next-line react-hooks/rules-of-hooks
    useRetrieveResource(createQuery);
  });
  const nonFetchedStates = states.filter(function (state) {
    return !state.fetched;
  });

  if (nonFetchedStates.length !== 0) {
    return [true, []];
  }

  return [false, states.map(function (state) {
    return state.result;
  })];
}

function useResource(createQuery, subscribe) {
  const state = subscribe ? // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResourceAndSubscribe(createQuery) : // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResource(createQuery);

  if (!state.fetched) {
    return [true, undefined];
  }

  return [false, state.result];
}

export { useResource, useResources };
//# sourceMappingURL=index-browsermodern.es.js.map
