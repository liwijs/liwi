import { createContext, useContext, useState, useEffect, useRef, useCallback, useReducer, useMemo } from 'react';
import { jsx } from 'react/jsx-runtime';
import { Logger } from 'nightingale-logger';
import { Lazy } from 'mingo/lazy';
import { $sort } from 'mingo/operators/pipeline/sort';
export { ResourcesServerError } from 'liwi-resources-client';

const TransportClientContext = /*#__PURE__*/createContext(undefined);
const TransportClientStateContext = /*#__PURE__*/createContext("opening");
const TransportClientReadyContext = /*#__PURE__*/createContext(false);
const useTransportClientState = () => useContext(TransportClientStateContext);
const useTransportClientIsReady = () => useContext(TransportClientReadyContext);
function TransportClientProvider({
  createFn,
  children,
  ...params
}) {
  // eslint-disable-next-line react/hook-use-state
  const [client] = useState(() => {
    return createFn(params);
  });
  const [connectionState, setConnectionState] = useState("opening");
  useEffect(() => {
    const closeConnectionStateListener = client.listenStateChange(setConnectionState);
    client.connect();
    return () => {
      closeConnectionStateListener();
      client.close();
    };
  }, [client]);
  return /*#__PURE__*/jsx(TransportClientContext.Provider, {
    value: client,
    children: /*#__PURE__*/jsx(TransportClientStateContext.Provider, {
      value: connectionState,
      children: /*#__PURE__*/jsx(TransportClientReadyContext.Provider, {
        value: connectionState === "connected",
        children: children
      })
    })
  });
}

const createResourceResultFromState = state => (
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
{
  query: state.query,
  initialLoading: !state.fetched && state.fetching,
  initialError: !state.fetched && !!state.error,
  fetched: state.fetched,
  fetching: state.fetching,
  data: !state.fetched ? undefined : state.result,
  meta: !state.fetched ? undefined : state.meta,
  queryInfo: !state.fetched ? undefined : state.queryInfo,
  error: state.error
});

function initReducer(initializer) {
  const init = initializer();
  const {
    query,
    promise
  } = init;
  return {
    fetched: false,
    fetching: true,
    query,
    result: undefined,
    meta: undefined,
    queryInfo: undefined,
    promise,
    error: undefined
  };
}
function reducer(state, action) {
  switch (action.type) {
    case "resolve":
      return {
        fetched: true,
        fetching: false,
        query: state.query,
        result: action.result,
        meta: action.meta,
        queryInfo: action.queryInfo,
        error: undefined
      };
    case "refetch":
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return {
        fetched: state.fetched,
        fetching: true,
        query: state.query,
        result: state.result,
        meta: state.meta,
        queryInfo: state.queryInfo,
        promise: action.promise,
        error: state.error
      };
    case "fetching":
      return {
        ...state,
        fetching: true
      };
    case "error":
      return {
        ...state,
        fetching: false,
        error: action.error
      };
    default:
      throw new Error("Invalid action");
  }
}

// eslint-disable-next-line @typescript-eslint/max-params
function useRetrieveResource(createQuery, params, skip, deps) {
  const isTransportReady = useContext(TransportClientReadyContext);
  const wasReady = useRef(isTransportReady);
  const currentFetchId = useRef(0);
  const fetch = useCallback((query, callback) => {
    const fetchId = ++currentFetchId.current;
    return query.fetch(result => {
      if (currentFetchId.current === fetchId) {
        callback(result);
      }
    });
  }, []);
  const [state, dispatch] = useReducer(reducer, () => {
    const query = createQuery(params);
    if (!isTransportReady || skip) return {
      query
    };
    return {
      query,
      promise: fetch(query, ({
        result,
        meta,
        info
      }) => {
        dispatch({
          type: "resolve",
          result,
          meta,
          queryInfo: info
        });
      }).catch(error => {
        dispatch({
          type: "error",
          error: error
        });
      })
    };
  }, initReducer);
  useEffect(() => {
    if (wasReady.current) return;
    if (!isTransportReady) return;
    if (skip) return;
    wasReady.current = true;
    dispatch({
      type: "refetch",
      promise: fetch(state.query, ({
        result,
        meta,
        info
      }) => {
        dispatch({
          type: "resolve",
          result,
          meta,
          queryInfo: info
        });
      }).catch(error => {
        dispatch({
          type: "error",
          error: error
        });
      })
    });
  }, [isTransportReady, fetch, skip, state.query]);
  const firstEffectChangeParams = useRef(false);
  useEffect(() => {
    if (!firstEffectChangeParams.current) {
      firstEffectChangeParams.current = true;
      return;
    }
    if (skip) {
      return;
    }
    state.query.changeParams(params);
    if (!wasReady.current) return;
    dispatch({
      type: "refetch",
      promise: fetch(state.query, ({
        result,
        meta,
        info
      }) => {
        dispatch({
          type: "resolve",
          result,
          meta,
          queryInfo: info
        });
      }).catch(error => {
        dispatch({
          type: "error",
          error: error
        });
      })
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.query, skip, ...deps]);
  return createResourceResultFromState(state);
}

function sortCollection(collection, sort) {
  return $sort(Lazy(collection), sort, {
    idKey: "_id"
  }).value();
}
const copy = state => [...state];
const applyCollectionChange = (state, change, queryMeta, queryInfo
// eslint-disable-next-line @typescript-eslint/max-params
) => {
  switch (change.type) {
    case "initial":
      {
        const keyPath = queryInfo.keyPath;

        // update meta
        Object.assign(queryMeta, change.meta);

        // update state if exists, keeping ref to avoid rerendering everything
        return !state ? change.initial : change.initial.map(value => {
          const existing = state.find(v => v[keyPath] === value[keyPath]);
          if (!existing) return value;
          return JSON.stringify(existing) === JSON.stringify(value) ? existing : value;
        });
      }
    case "inserted":
      {
        queryMeta.total += change.result.length;
        let newCollection = [...change.result, ...state];
        if (queryInfo.sort) {
          newCollection = sortCollection(newCollection, queryInfo.sort);
        }
        if (!queryInfo.limit) return newCollection;
        return newCollection.slice(0, queryInfo.limit - change.result.length);
      }
    case "deleted":
      {
        queryMeta.total -= change.keys.length;
        const keyPath = queryInfo.keyPath;
        const deletedKeys = change.keys;
        return state.filter(value => !deletedKeys.includes(value[keyPath]));
      }
    case "updated":
      {
        const keyPath = queryInfo.keyPath;
        const newState = copy(state);
        change.result.forEach(newObject => {
          const index = newState.findIndex(o => o[keyPath] === newObject[keyPath]);
          if (index === -1) return;
          newState[index] = newObject;
        });
        return newState;
      }
    default:
      throw new Error("Invalid type");
  }
};

// https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js
// eslint-disable-next-line @typescript-eslint/max-params
function applyCollectionChanges(state, changes, queryMeta, queryInfo) {
  if (state === undefined) return {
    state,
    meta: queryMeta
  };
  const newQueryMeta = {
    ...queryMeta
  };
  return {
    // eslint-disable-next-line unicorn/no-array-reduce
    state: changes.reduce((result, change) => applyCollectionChange(result, change, newQueryMeta, queryInfo), state),
    meta: newQueryMeta
  };
}

const applySingleItemChange = (state, change, queryMeta

// eslint-disable-next-line @typescript-eslint/max-params
) => {
  switch (change.type) {
    case "initial":
      queryMeta.total = change.initial === null ? 0 : 1;
      return change.initial;
    case "updated":
      {
        queryMeta.total = change.result === null ? 0 : 1;
        return change.result;
      }
    case "deleted":
      {
        queryMeta.total = 0;
        return null;
      }
    case "inserted":
    default:
      throw new Error("Invalid type");
  }
};

// https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js
// eslint-disable-next-line @typescript-eslint/max-params
function applySingleItemChanges(state, changes, queryMeta, queryInfo) {
  if (state === undefined) return {
    state,
    meta: queryMeta
  };
  const newQueryMeta = {
    ...queryMeta
  };
  return {
    // eslint-disable-next-line unicorn/no-array-reduce
    state: changes.reduce((result, change) => applySingleItemChange(result, change, queryMeta), state),
    meta: newQueryMeta
  };
}

const useVisibilityChangeSubscriber = () => {
  const handleVisibilityChangeRef = useRef();
  return useMemo(() => ({
    subscribe: handleVisibilityChange => {
      handleVisibilityChangeRef.current = handleVisibilityChange;
      document.addEventListener("visibilitychange", handleVisibilityChange, false);
    },
    unsubscribe: () => {
      if (handleVisibilityChangeRef.current) {
        document.removeEventListener("visibilitychange", handleVisibilityChangeRef.current);
      }
    }
  }), []);
};

const defaultOptions = {
  visibleTimeout: 120000 // 2 minutes
};
const logger = new Logger("react-liwi:useResourceAndSubscribe");
const isInitial = changes => changes.length === 1 && changes[0].type === "initial";
function useRetrieveResourceAndSubscribe(createQuery, params, skip, deps, {
  visibleTimeout
} = defaultOptions) {
  const visibilityChangeSubscriber = useVisibilityChangeSubscriber();
  const querySubscriptionRef = useRef(undefined);
  const timeoutRef = useRef(undefined);
  const changeParamsRef = useRef(undefined);
  const skipRef = useRef(skip);
  skipRef.current = skip;
  const unsubscribe = () => {
    logger.info("unsubscribe");

    // reset timeout to allow resubscribing
    timeoutRef.current = undefined;
    if (querySubscriptionRef.current) {
      querySubscriptionRef.current.stop();
      querySubscriptionRef.current = undefined;
    }
  };
  const [state, dispatch] = useReducer(reducer, () => {
    const query = createQuery(params);
    let applyChanges;
    let currentResult;
    let currentMeta;
    let currentQueryInfo;
    return {
      query,
      promise: new Promise(() => {
        const queryLogger = logger.context({
          resourceName: query.resourceName,
          key: query.key
        });
        queryLogger.debug("init");
        const subscribe = () => {
          queryLogger.debug("subscribing", {
            querySubscriptionRef: querySubscriptionRef.current,
            timeoutRef: timeoutRef.current
          });
          querySubscriptionRef.current = query.fetchAndSubscribe((err, changes) => {
            queryLogger.debug("received changes", {
              err,
              changes
            });
            if (err) {
              dispatch({
                type: "error",
                error: err
              });
              return;
            }
            if (!currentResult && isInitial(changes)) {
              const initialChange = changes[0];
              currentResult = initialChange.initial;
              currentMeta = initialChange.meta;
              currentQueryInfo = initialChange.queryInfo;
              dispatch({
                type: "resolve",
                result: initialChange.initial,
                meta: initialChange.meta,
                queryInfo: currentQueryInfo
              });
              applyChanges = Array.isArray(initialChange.initial) ? applyCollectionChanges : applySingleItemChanges;
            }
            // if a change happen before the initial result, applyChanges will be undefined
            else if (applyChanges) {
              const {
                state: newResult,
                meta: newMeta
              } = applyChanges(currentResult, changes, currentMeta, currentQueryInfo);
              if (newResult && newResult !== currentResult) {
                currentResult = newResult;
                currentMeta = newMeta;
                dispatch({
                  type: "resolve",
                  result: newResult,
                  meta: newMeta,
                  queryInfo: currentQueryInfo
                });
              }
            }
          });
          querySubscriptionRef.current.then(() => {
            queryLogger.success("subscribed");
          }, error => {
            dispatch({
              type: "error",
              error
            });
          });
        };
        changeParamsRef.current = changedParams => {
          queryLogger.info("change params", {
            skip: skipRef.current,
            params: changedParams
          });
          if (querySubscriptionRef.current) {
            querySubscriptionRef.current.stop();
          }
          query.changeParams(changedParams);
          if (!document.hidden && !skipRef.current) {
            dispatch({
              type: "fetching"
            });
            subscribe();
          }
        };
        visibilityChangeSubscriber.subscribe(() => {
          if (skipRef.current) return;
          if (!document.hidden) {
            if (timeoutRef.current !== undefined) {
              queryLogger.debug("timeout cleared");
              clearTimeout(timeoutRef.current);
              timeoutRef.current = undefined;
            } else if (!querySubscriptionRef.current) {
              queryLogger.info("resubscribe");
              dispatch({
                type: "fetching"
              });
              subscribe();
            }
            return;
          }
          if (querySubscriptionRef.current === undefined) return;
          queryLogger.debug("timeout visible");
          timeoutRef.current = setTimeout(unsubscribe, visibleTimeout);
        });
        if (!document.hidden && !skipRef.current) {
          subscribe();
        }
      })
    };
  }, initReducer);
  const firstEffectChangeParams = useRef(false);
  useEffect(() => {
    if (!firstEffectChangeParams.current) {
      firstEffectChangeParams.current = true;
      return;
    }
    if (changeParamsRef.current) {
      changeParamsRef.current(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, ...deps]);
  useEffect(() => {
    return () => {
      visibilityChangeSubscriber.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      unsubscribe();
    };
  }, [visibilityChangeSubscriber]);
  return useMemo(() => createResourceResultFromState(state), [state]);
}

const isSSR = typeof window === "undefined";
function useResource(createQuery, {
  params,
  skip = false,
  subscribe,
  subscribeOptions
}, deps) {
  const result = subscribe && !isSSR ?
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResourceAndSubscribe(createQuery, params, skip, deps, subscribeOptions) :
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResource(createQuery, params, skip, deps);
  return result;
}

function usePaginatedResource(createQuery, options, deps) {
  const result = useResource(createQuery, options, deps);
  const total = result.meta?.total;
  const limit = result.queryInfo?.limit;
  const pagination = useMemo(() => {
    if (total === undefined) return undefined;
    return {
      totalPages: limit ? Math.ceil(total / limit) : 1
    };
  }, [total, limit]);
  return useMemo(() => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  {
    ...result,
    pagination
  }), [result, pagination]);
}

function useOperation(operationCall) {
  const [state, setState] = useState(() => ({
    loading: false,
    error: undefined
  }));
  const operationCallWrapper = useCallback((...params) => {
    setState({
      loading: true,
      error: undefined
    });
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return operationCall(...params).then(result => {
        setState({
          loading: false,
          error: undefined
        });
        return [undefined, result];
      }, error => {
        setState({
          loading: false,
          error: error instanceof Error ? error : new Error(String(error))
        });
        return [error, undefined];
      });
    } catch (error) {
      setState({
        loading: false,
        error: error
      });
      return Promise.resolve([error, undefined]);
    }
  }, [operationCall]);
  return [operationCallWrapper, state];
}

const transportClientStateToSimplifiedState = state => {
  switch (state) {
    case "opening":
    case "connecting":
    case "reconnect-scheduled":
    case "wait-for-visibility":
      return "connecting";
    case "connected":
      return "connected";
    case "closed":
      return "disconnected";
    default:
      throw new Error("Invalid state");
  }
};

export { TransportClientContext, TransportClientProvider, TransportClientReadyContext, TransportClientStateContext, transportClientStateToSimplifiedState, useOperation, usePaginatedResource, useResource, useTransportClientIsReady, useTransportClientState };
//# sourceMappingURL=index-browser.es.js.map
