'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Logger = require('nightingale-logger');
var lazy = require('mingo/lazy');
var pipeline = require('mingo/operators/pipeline');
var liwiResourcesClient = require('liwi-resources-client');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);

const TransportClientContext = /*#__PURE__*/React.createContext(undefined);
const TransportClientStateContext = /*#__PURE__*/React.createContext('opening');
const TransportClientReadyContext = /*#__PURE__*/React.createContext(false);
function TransportClientProvider({
  createFn,
  children,
  ...params
}) {
  const [client] = React.useState(() => {
    return createFn(params);
  });
  const [connectionState, setConnectionState] = React.useState('opening');
  React.useEffect(() => {
    const closeConnectionStateListener = client.listenStateChange(setConnectionState);
    client.connect();
    return () => {
      closeConnectionStateListener();
      client.close();
    };
  }, [client]);
  return /*#__PURE__*/React__default.createElement(TransportClientContext.Provider, {
    value: client
  }, /*#__PURE__*/React__default.createElement(TransportClientStateContext.Provider, {
    value: connectionState
  }, /*#__PURE__*/React__default.createElement(TransportClientReadyContext.Provider, {
    value: connectionState === 'connected'
  }, children)));
}

const createResourceResultFromState = state => ({
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
    case 'resolve':
      return {
        fetched: true,
        fetching: false,
        query: state.query,
        result: action.result,
        meta: action.meta,
        queryInfo: action.queryInfo,
        error: undefined
      };

    case 'refetch':
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

    case 'fetching':
      return { ...state,
        fetching: true
      };

    case 'error':
      return { ...state,
        fetching: false,
        error: action.error
      };

    default:
      throw new Error('Invalid action');
  }
}

function useRetrieveResource(createQuery, params, skip, deps) {
  const isTransportReady = React.useContext(TransportClientReadyContext);
  const wasReady = React.useRef(isTransportReady);
  const currentFetchId = React.useRef(0);
  const fetch = React.useCallback((query, callback) => {
    const fetchId = ++currentFetchId.current;
    return query.fetch(result => {
      if (currentFetchId.current === fetchId) {
        callback(result);
      }
    });
  }, []);
  const [state, dispatch] = React.useReducer(reducer, () => {
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
          type: 'resolve',
          result,
          meta,
          queryInfo: info
        });
      }).catch(err => {
        dispatch({
          type: 'error',
          error: err
        });
      })
    };
  }, initReducer);
  React.useEffect(() => {
    if (wasReady.current) return;
    if (!isTransportReady) return;
    if (skip) return;
    wasReady.current = true;
    dispatch({
      type: 'refetch',
      promise: fetch(state.query, ({
        result,
        meta,
        info
      }) => {
        dispatch({
          type: 'resolve',
          result,
          meta,
          queryInfo: info
        });
      }).catch(err => {
        dispatch({
          type: 'error',
          error: err
        });
      })
    });
  }, [isTransportReady, fetch, skip, state.query]);
  const firstEffectChangeParams = React.useRef(false);
  React.useEffect(() => {
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
      promise: fetch(state.query, ({
        result,
        meta,
        info
      }) => {
        dispatch({
          type: 'resolve',
          result,
          meta,
          queryInfo: info
        });
      }).catch(err => {
        dispatch({
          type: 'error',
          error: err
        });
      })
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.query, skip, ...deps]);
  return createResourceResultFromState(state);
}

/* eslint-disable complexity */

function sortCollection(collection, sort) {
  return pipeline.$sort(lazy.Lazy(collection), sort, {
    idKey: '_id'
  }).value();
}

const copy = state => [...state];

const applyCollectionChange = (state, change, queryMeta, queryInfo) => {
  switch (change.type) {
    case 'initial':
      {
        const keyPath = queryInfo.keyPath;
        return !state ? change.initial : change.initial.map(value => {
          const existing = state.find(v => v[keyPath] === value[keyPath]);
          if (!existing) return value;
          return JSON.stringify(existing) === JSON.stringify(value) ? existing : value;
        });
      }

    case 'inserted':
      {
        queryMeta.total += change.result.length;
        let newCollection = [...change.result, ...state];

        if (queryInfo.sort) {
          newCollection = sortCollection(newCollection, queryInfo.sort);
        }

        if (!queryInfo.limit) return newCollection;
        return newCollection.slice(0, queryInfo.limit - change.result.length);
      }

    case 'deleted':
      {
        queryMeta.total -= change.keys.length;
        const keyPath = queryInfo.keyPath;
        const deletedKeys = change.keys;
        return state.filter(value => !deletedKeys.includes(value[keyPath]));
      }

    case 'updated':
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
      throw new Error('Invalid type');
  }
}; // https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js


function applyCollectionChanges(state, changes, queryMeta, queryInfo) {
  if (state === undefined) return {
    state,
    meta: queryMeta
  };
  const newQueryMeta = { ...queryMeta
  };
  return {
    // eslint-ignore-next-line unicorn/no-reduce
    state: changes.reduce((result, change) => applyCollectionChange(result, change, queryMeta, queryInfo), state),
    meta: newQueryMeta
  };
}

const applySingleItemChange = (state, change, queryMeta) => {
  switch (change.type) {
    case 'initial':
      queryMeta.total = change.initial === null ? 0 : 1;
      return change.initial;

    case 'updated':
      {
        queryMeta.total = change.result === null ? 0 : 1;
        return change.result;
      }

    case 'deleted':
      {
        queryMeta.total = 0;
        return null;
      }

    default:
      throw new Error('Invalid type');
  }
}; // https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js


function applySingleItemChanges(state, changes, queryMeta, queryInfo) {
  if (state === undefined) return {
    state,
    meta: queryMeta
  };
  const newQueryMeta = { ...queryMeta
  };
  return {
    // eslint-ignore-next-line unicorn/no-reduce
    state: changes.reduce((result, change) => applySingleItemChange(result, change, queryMeta), state),
    meta: newQueryMeta
  };
}

/* eslint-disable max-lines */
const defaultOptions = {
  visibleTimeout: 120000 // 2 minutes

};
const logger = new Logger__default('react-liwi:useResourceAndSubscribe');

const isInitial = changes => changes.length === 1 && changes[0].type === 'initial';

function useRetrieveResourceAndSubscribe(createQuery, params, skip, deps, {
  visibleTimeout
} = defaultOptions) {
  const querySubscriptionRef = React.useRef(undefined);
  const timeoutRef = React.useRef(undefined);
  const changeParamsRef = React.useRef(undefined);
  const handleVisibilityChangeRef = React.useRef(undefined);
  const skipRef = React.useRef(skip);
  skipRef.current = skip;

  const unsubscribe = () => {
    logger.info('unsubscribe'); // reset timeout to allow resubscribing

    timeoutRef.current = undefined;

    if (querySubscriptionRef.current) {
      querySubscriptionRef.current.stop();
      querySubscriptionRef.current = undefined;
    }
  };

  const [state, dispatch] = React.useReducer(reducer, () => {
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
        queryLogger.debug('init');

        const subscribe = () => {
          queryLogger.debug('subscribing', {
            querySubscriptionRef: querySubscriptionRef.current,
            timeoutRef: timeoutRef.current
          });
          querySubscriptionRef.current = query.fetchAndSubscribe((err, changes) => {
            queryLogger.debug('received changes', {
              err,
              changes
            });

            if (err) {
              dispatch({
                type: 'error',
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
                type: 'resolve',
                result: initialChange.initial,
                meta: initialChange.meta,
                queryInfo: currentQueryInfo
              });
              applyChanges = Array.isArray(initialChange.initial) ? applyCollectionChanges : applySingleItemChanges;
            } else {
              const {
                state: newResult,
                meta: newMeta
              } = applyChanges(currentResult, changes, currentMeta, currentQueryInfo);

              if (newResult && newResult !== currentResult) {
                currentResult = newResult;
                currentMeta = newMeta;
                dispatch({
                  type: 'resolve',
                  result: newResult,
                  meta: newMeta,
                  queryInfo: currentQueryInfo
                });
              }
            }
          });
          querySubscriptionRef.current.then(() => {
            queryLogger.success('subscribed');
          }, err => {
            dispatch({
              type: 'error',
              error: err
            });
          });
        };

        changeParamsRef.current = params => {
          queryLogger.info('change params', {
            skip: skipRef.current,
            params
          });

          if (querySubscriptionRef.current) {
            querySubscriptionRef.current.stop();
          }

          query.changeParams(params);

          if (!document.hidden && !skipRef.current) {
            dispatch({
              type: 'fetching'
            });
            subscribe();
          }
        };

        const handleVisibilityChange = () => {
          if (skipRef.current) return;

          if (!document.hidden) {
            if (timeoutRef.current !== undefined) {
              queryLogger.debug('timeout cleared');
              clearTimeout(timeoutRef.current);
              timeoutRef.current = undefined;
            } else if (!querySubscriptionRef.current) {
              queryLogger.info('resubscribe');
              dispatch({
                type: 'fetching'
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
        document.addEventListener('visibilitychange', handleVisibilityChange, false);

        if (!document.hidden) {
          subscribe();
        }
      })
    };
  }, initReducer);
  const firstEffectChangeParams = React.useRef(false);
  React.useEffect(() => {
    if (firstEffectChangeParams.current === false) {
      firstEffectChangeParams.current = true;
      return;
    }

    if (changeParamsRef.current) {
      changeParamsRef.current(params);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [skip, ...deps]);
  React.useEffect(() => {
    return () => {
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
  return React.useMemo(() => createResourceResultFromState(state), [state]);
}

function useResource(createQuery, {
  params,
  skip = false,
  subscribe,
  subscribeOptions
}, deps) {
  const result = subscribe ? // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResourceAndSubscribe(createQuery, params, skip, deps, subscribeOptions) : // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResource(createQuery, params, skip, deps);
  return result;
}

function usePaginatedResource(createQuery, options, deps) {
  var _result$meta, _result$queryInfo;

  const result = useResource(createQuery, options, deps);
  const total = (_result$meta = result.meta) == null ? void 0 : _result$meta.total;
  const limit = (_result$queryInfo = result.queryInfo) == null ? void 0 : _result$queryInfo.limit;
  const pagination = React.useMemo(() => {
    if (total === undefined) return undefined;
    return {
      totalPages: limit ? Math.ceil(total / limit) : 1
    };
  }, [total, limit]);
  return React.useMemo(() => ({ ...result,
    pagination
  }), [result, pagination]);
}

function useOperation(operationCall) {
  const [state, setState] = React.useState(() => ({
    loading: false,
    error: undefined
  }));
  const operationCallWrapper = React.useCallback((...params) => {
    setState({
      loading: true,
      error: undefined
    });

    try {
      return operationCall(...params).then(result => {
        setState({
          loading: false,
          error: undefined
        });
        return [undefined, result];
      }, err => {
        setState({
          loading: false,
          error: err
        });
        return [err, undefined];
      });
    } catch (err) {
      setState({
        loading: false,
        error: err
      });
      return Promise.resolve([err, undefined]);
    }
  }, [operationCall]);
  return [operationCallWrapper, state];
}

exports.ResourcesServerError = liwiResourcesClient.ResourcesServerError;
exports.TransportClientContext = TransportClientContext;
exports.TransportClientProvider = TransportClientProvider;
exports.TransportClientReadyContext = TransportClientReadyContext;
exports.TransportClientStateContext = TransportClientStateContext;
exports.useOperation = useOperation;
exports.usePaginatedResource = usePaginatedResource;
exports.useResource = useResource;
//# sourceMappingURL=index-browser-dev.cjs.js.map
