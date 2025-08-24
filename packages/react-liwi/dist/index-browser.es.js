import { createContext, useContext, useState, useEffect, useRef, useCallback, useReducer, useMemo } from 'react';
import { jsx } from 'react/jsx-runtime';
import { Logger } from 'nightingale-logger';
import { Lazy } from 'mingo/lazy';
import { $sort } from 'mingo/operators/pipeline/sort';
export { ResourcesServerError } from 'liwi-resources-client';

const TransportClientContext = createContext(
  void 0
);
const TransportClientStateContext = createContext("opening");
const TransportClientReadyContext = createContext(false);
const useTransportClientState = () => useContext(TransportClientStateContext);
const useTransportClientIsReady = () => useContext(TransportClientReadyContext);
function TransportClientProvider({
  createFn,
  children,
  ...params
}) {
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
  return /* @__PURE__ */ jsx(TransportClientContext.Provider, { value: client, children: /* @__PURE__ */ jsx(TransportClientStateContext.Provider, { value: connectionState, children: /* @__PURE__ */ jsx(
    TransportClientReadyContext.Provider,
    {
      value: connectionState === "connected",
      children
    }
  ) }) });
}

const createResourceResultFromState = (state) => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  {
    query: state.query,
    initialLoading: !state.fetched && state.fetching,
    initialError: !state.fetched && !!state.error,
    fetched: state.fetched,
    fetching: state.fetching,
    data: !state.fetched ? void 0 : state.result,
    meta: !state.fetched ? void 0 : state.meta,
    queryInfo: !state.fetched ? void 0 : state.queryInfo,
    error: state.error
  }
);

function initReducer(initializer) {
  const init = initializer();
  const { query, promise } = init;
  return {
    fetched: false,
    fetching: true,
    query,
    result: void 0,
    meta: void 0,
    queryInfo: void 0,
    promise,
    error: void 0
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
        error: void 0
      };
    case "refetch":
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

function useRetrieveResource(createQuery, params, skip, deps) {
  const isTransportReady = useContext(TransportClientReadyContext);
  const wasReady = useRef(isTransportReady);
  const currentFetchId = useRef(0);
  const fetch = useCallback(
    (query, callback) => {
      const fetchId = ++currentFetchId.current;
      return query.fetch((result) => {
        if (currentFetchId.current === fetchId) {
          callback(result);
        }
      });
    },
    []
  );
  const [state, dispatch] = useReducer(
    reducer,
    () => {
      const query = createQuery(params);
      if (!isTransportReady || skip) return { query };
      return {
        query,
        promise: fetch(query, ({ result, meta, info }) => {
          dispatch({ type: "resolve", result, meta, queryInfo: info });
        }).catch((error) => {
          dispatch({ type: "error", error });
        })
      };
    },
    initReducer
  );
  useEffect(() => {
    if (wasReady.current) return;
    if (!isTransportReady) return;
    if (skip) return;
    wasReady.current = true;
    dispatch({
      type: "refetch",
      promise: fetch(state.query, ({ result, meta, info }) => {
        dispatch({ type: "resolve", result, meta, queryInfo: info });
      }).catch((error) => {
        dispatch({ type: "error", error });
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
      promise: fetch(state.query, ({ result, meta, info }) => {
        dispatch({ type: "resolve", result, meta, queryInfo: info });
      }).catch((error) => {
        dispatch({ type: "error", error });
      })
    });
  }, [state.query, skip, ...deps]);
  return createResourceResultFromState(state);
}

function sortCollection(collection, sort) {
  return $sort(Lazy(collection), sort, { idKey: "_id" }).value();
}
const copy = (state) => [...state];
const applyCollectionChange = (state, change, queryMeta, queryInfo) => {
  switch (change.type) {
    case "initial": {
      const keyPath = queryInfo.keyPath;
      Object.assign(queryMeta, change.meta);
      return !state ? change.initial : change.initial.map((value) => {
        const existing = state.find((v) => v[keyPath] === value[keyPath]);
        if (!existing) return value;
        return JSON.stringify(existing) === JSON.stringify(value) ? existing : value;
      });
    }
    case "inserted": {
      queryMeta.total += change.result.length;
      let newCollection = [...change.result, ...state];
      if (queryInfo.sort) {
        newCollection = sortCollection(newCollection, queryInfo.sort);
      }
      if (!queryInfo.limit) return newCollection;
      return newCollection.slice(0, queryInfo.limit - change.result.length);
    }
    case "deleted": {
      queryMeta.total -= change.keys.length;
      const keyPath = queryInfo.keyPath;
      const deletedKeys = change.keys;
      return state.filter((value) => !deletedKeys.includes(value[keyPath]));
    }
    case "updated": {
      const keyPath = queryInfo.keyPath;
      const newState = copy(state);
      change.result.forEach((newObject) => {
        const index = newState.findIndex(
          (o) => o[keyPath] === newObject[keyPath]
        );
        if (index === -1) return;
        newState[index] = newObject;
      });
      return newState;
    }
    default:
      throw new Error("Invalid type");
  }
};
function applyCollectionChanges(state, changes, queryMeta, queryInfo) {
  if (state === void 0) return { state, meta: queryMeta };
  const newQueryMeta = { ...queryMeta };
  return {
    // eslint-disable-next-line unicorn/no-array-reduce
    state: changes.reduce(
      (result, change) => applyCollectionChange(result, change, newQueryMeta, queryInfo),
      state
    ),
    meta: newQueryMeta
  };
}

const applySingleItemChange = (state, change, queryMeta, queryInfo) => {
  switch (change.type) {
    case "initial":
      queryMeta.total = change.initial === null ? 0 : 1;
      return change.initial;
    case "updated": {
      queryMeta.total = change.result === null ? 0 : 1;
      return change.result;
    }
    case "deleted": {
      queryMeta.total = 0;
      return null;
    }
    case "inserted":
    default:
      throw new Error("Invalid type");
  }
};
function applySingleItemChanges(state, changes, queryMeta, queryInfo) {
  if (state === void 0) return { state, meta: queryMeta };
  const newQueryMeta = { ...queryMeta };
  return {
    // eslint-disable-next-line unicorn/no-array-reduce
    state: changes.reduce(
      (result, change) => applySingleItemChange(result, change, queryMeta),
      state
    ),
    meta: newQueryMeta
  };
}

const useVisibilityChangeSubscriber = () => {
  const handleVisibilityChangeRef = useRef(
    void 0
  );
  return useMemo(
    () => ({
      subscribe: (handleVisibilityChange) => {
        handleVisibilityChangeRef.current = handleVisibilityChange;
        document.addEventListener(
          "visibilitychange",
          handleVisibilityChange,
          false
        );
      },
      unsubscribe: () => {
        if (handleVisibilityChangeRef.current) {
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChangeRef.current
          );
        }
      }
    }),
    []
  );
};

const defaultOptions = {
  visibleTimeout: 1e3 * 60 * 2
  // 2 minutes
};
const logger = new Logger("react-liwi:useResourceAndSubscribe");
const isInitial = (changes) => changes.length === 1 && changes[0]?.type === "initial";
function useRetrieveResourceAndSubscribe(createQuery, params, skip, deps, { visibleTimeout } = defaultOptions) {
  const visibilityChangeSubscriber = useVisibilityChangeSubscriber();
  const querySubscriptionRef = useRef(void 0);
  const timeoutRef = useRef(
    void 0
  );
  const changeParamsRef = useRef(
    void 0
  );
  const skipRef = useRef(skip);
  skipRef.current = skip;
  const unsubscribe = () => {
    logger.info("unsubscribe");
    timeoutRef.current = void 0;
    if (querySubscriptionRef.current) {
      querySubscriptionRef.current.stop();
      querySubscriptionRef.current = void 0;
    }
  };
  const [state, dispatch] = useReducer(
    reducer,
    () => {
      const query = createQuery(params);
      let applyChanges;
      let currentResult;
      let currentMeta;
      let currentQueryInfo;
      return {
        query,
        promise: new Promise((resolve, reject) => {
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
            querySubscriptionRef.current = query.fetchAndSubscribe(
              (err, changes) => {
                queryLogger.debug("received changes", { err, changes });
                if (err) {
                  dispatch({ type: "error", error: err });
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
                } else if (applyChanges) {
                  const { state: newResult, meta: newMeta } = applyChanges(
                    currentResult,
                    changes,
                    currentMeta,
                    currentQueryInfo
                  );
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
              }
            );
            querySubscriptionRef.current.then(
              () => {
                queryLogger.success("subscribed");
              },
              (error) => {
                dispatch({ type: "error", error });
              }
            );
          };
          changeParamsRef.current = (changedParams) => {
            queryLogger.info("change params", {
              skip: skipRef.current,
              params: changedParams
            });
            if (querySubscriptionRef.current) {
              querySubscriptionRef.current.stop();
            }
            query.changeParams(changedParams);
            if (!document.hidden && !skipRef.current) {
              dispatch({ type: "fetching" });
              subscribe();
            }
          };
          const handleVisibilityChange = () => {
            if (skipRef.current) return;
            if (!document.hidden) {
              if (timeoutRef.current !== void 0) {
                queryLogger.debug("timeout cleared");
                clearTimeout(timeoutRef.current);
                timeoutRef.current = void 0;
              } else if (!querySubscriptionRef.current) {
                queryLogger.info("resubscribe");
                dispatch({ type: "fetching" });
                subscribe();
              }
              return;
            }
            if (querySubscriptionRef.current === void 0) return;
            queryLogger.debug("timeout visible");
            timeoutRef.current = setTimeout(unsubscribe, visibleTimeout);
          };
          visibilityChangeSubscriber.subscribe(handleVisibilityChange);
          if (!document.hidden && !skipRef.current) {
            subscribe();
          }
        })
      };
    },
    initReducer
  );
  const firstEffectChangeParams = useRef(false);
  useEffect(() => {
    if (!firstEffectChangeParams.current) {
      firstEffectChangeParams.current = true;
      return;
    }
    if (changeParamsRef.current) {
      changeParamsRef.current(params);
    }
  }, [skip, ...deps]);
  useEffect(() => {
    return () => {
      visibilityChangeSubscriber.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = void 0;
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
  const result = subscribe && !isSSR ? (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRetrieveResourceAndSubscribe(
      createQuery,
      params,
      skip,
      deps,
      subscribeOptions
    )
  ) : (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRetrieveResource(
      createQuery,
      params,
      skip,
      deps
    )
  );
  return result;
}

function usePaginatedResource(createQuery, options, deps) {
  const result = useResource(createQuery, options, deps);
  const total = result.meta?.total;
  const limit = result.queryInfo?.limit;
  const pagination = useMemo(() => {
    if (total === void 0) return void 0;
    return {
      totalPages: limit ? Math.ceil(total / limit) : 1
    };
  }, [total, limit]);
  return useMemo(
    () => (
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      { ...result, pagination }
    ),
    [result, pagination]
  );
}

function useOperation(operationCall) {
  const [state, setState] = useState(() => ({
    loading: false,
    error: void 0
  }));
  const operationCallWrapper = useCallback(
    (...params) => {
      setState({
        loading: true,
        error: void 0
      });
      try {
        return operationCall(...params).then(
          (result) => {
            setState({
              loading: false,
              error: void 0
            });
            return [void 0, result];
          },
          (error) => {
            setState({
              loading: false,
              error: error instanceof Error ? error : new Error(String(error))
            });
            return [error, void 0];
          }
        );
      } catch (error) {
        setState({
          loading: false,
          error
        });
        return Promise.resolve([error, void 0]);
      }
    },
    [operationCall]
  );
  return [operationCallWrapper, state];
}

const transportClientStateToSimplifiedState = (state) => {
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
