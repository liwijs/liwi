import { createContext, useContext, useState, useEffect, useRef, useCallback, useReducer, useMemo } from 'react';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { jsx } from 'react/jsx-runtime.js';
import _extends from '@babel/runtime/helpers/esm/extends';
import { Logger } from 'nightingale-logger';
import { Lazy } from 'mingo/lazy.js';
import { $sort } from 'mingo/operators/pipeline/sort.js';
export { ResourcesServerError } from 'liwi-resources-client';

var _excluded = ["createFn", "children"];
var TransportClientContext = /*#__PURE__*/createContext(undefined);
var TransportClientStateContext = /*#__PURE__*/createContext('opening');
var TransportClientReadyContext = /*#__PURE__*/createContext(false);
var useTransportClientState = function useTransportClientState() {
  return useContext(TransportClientStateContext);
};
var useTransportClientIsReady = function useTransportClientIsReady() {
  return useContext(TransportClientReadyContext);
};
function TransportClientProvider(_ref) {
  var createFn = _ref.createFn,
      children = _ref.children,
      params = _objectWithoutPropertiesLoose(_ref, _excluded);

  var _useState = useState(function () {
    return createFn(params);
  }),
      client = _useState[0];

  var _useState2 = useState('opening'),
      connectionState = _useState2[0],
      setConnectionState = _useState2[1];

  useEffect(function () {
    var closeConnectionStateListener = client.listenStateChange(setConnectionState);
    client.connect();
    return function () {
      closeConnectionStateListener();
      client.close();
    };
  }, [client]);
  return /*#__PURE__*/jsx(TransportClientContext.Provider, {
    value: client,
    children: /*#__PURE__*/jsx(TransportClientStateContext.Provider, {
      value: connectionState,
      children: /*#__PURE__*/jsx(TransportClientReadyContext.Provider, {
        value: connectionState === 'connected',
        children: children
      })
    })
  });
}

var createResourceResultFromState = function createResourceResultFromState(state) {
  return {
    query: state.query,
    initialLoading: !state.fetched && state.fetching,
    initialError: !state.fetched && !!state.error,
    fetched: state.fetched,
    fetching: state.fetching,
    data: !state.fetched ? undefined : state.result,
    meta: !state.fetched ? undefined : state.meta,
    queryInfo: !state.fetched ? undefined : state.queryInfo,
    error: state.error
  };
};

function initReducer(initializer) {
  var init = initializer();
  var query = init.query,
      promise = init.promise;
  return {
    fetched: false,
    fetching: true,
    query: query,
    result: undefined,
    meta: undefined,
    queryInfo: undefined,
    promise: promise,
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
      return _extends({}, state, {
        fetching: true
      });

    case 'error':
      return _extends({}, state, {
        fetching: false,
        error: action.error
      });

    default:
      throw new Error('Invalid action');
  }
}

function useRetrieveResource(createQuery, params, skip, deps) {
  var isTransportReady = useContext(TransportClientReadyContext);
  var wasReady = useRef(isTransportReady);
  var currentFetchId = useRef(0);
  var fetch = useCallback(function (query, callback) {
    var fetchId = ++currentFetchId.current;
    return query.fetch(function (result) {
      if (currentFetchId.current === fetchId) {
        callback(result);
      }
    });
  }, []);

  var _useReducer = useReducer(reducer, function () {
    var query = createQuery(params);
    if (!isTransportReady || skip) return {
      query: query
    };
    return {
      query: query,
      promise: fetch(query, function (_ref) {
        var result = _ref.result,
            meta = _ref.meta,
            info = _ref.info;
        dispatch({
          type: 'resolve',
          result: result,
          meta: meta,
          queryInfo: info
        });
      })["catch"](function (err) {
        dispatch({
          type: 'error',
          error: err
        });
      })
    };
  }, initReducer),
      state = _useReducer[0],
      dispatch = _useReducer[1];

  useEffect(function () {
    if (wasReady.current) return;
    if (!isTransportReady) return;
    if (skip) return;
    wasReady.current = true;
    dispatch({
      type: 'refetch',
      promise: fetch(state.query, function (_ref2) {
        var result = _ref2.result,
            meta = _ref2.meta,
            info = _ref2.info;
        dispatch({
          type: 'resolve',
          result: result,
          meta: meta,
          queryInfo: info
        });
      })["catch"](function (err) {
        dispatch({
          type: 'error',
          error: err
        });
      })
    });
  }, [isTransportReady, fetch, skip, state.query]);
  var firstEffectChangeParams = useRef(false);
  useEffect(function () {
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
      type: 'refetch',
      promise: fetch(state.query, function (_ref3) {
        var result = _ref3.result,
            meta = _ref3.meta,
            info = _ref3.info;
        dispatch({
          type: 'resolve',
          result: result,
          meta: meta,
          queryInfo: info
        });
      })["catch"](function (err) {
        dispatch({
          type: 'error',
          error: err
        });
      })
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.query, skip].concat(deps));
  return createResourceResultFromState(state);
}

function sortCollection(collection, sort) {
  return $sort(Lazy(collection), sort, {
    idKey: '_id'
  }).value();
}

var copy = function copy(state) {
  return [].concat(state);
};

var applyCollectionChange = function applyCollectionChange(state, change, queryMeta, queryInfo) {
  switch (change.type) {
    case 'initial':
      {
        var keyPath = queryInfo.keyPath;
        return !state ? change.initial : change.initial.map(function (value) {
          var existing = state.find(function (v) {
            return v[keyPath] === value[keyPath];
          });
          if (!existing) return value;
          return JSON.stringify(existing) === JSON.stringify(value) ? existing : value;
        });
      }

    case 'inserted':
      {
        queryMeta.total += change.result.length;
        var newCollection = [].concat(change.result, state);

        if (queryInfo.sort) {
          newCollection = sortCollection(newCollection, queryInfo.sort);
        }

        if (!queryInfo.limit) return newCollection;
        return newCollection.slice(0, queryInfo.limit - change.result.length);
      }

    case 'deleted':
      {
        queryMeta.total -= change.keys.length;
        var _keyPath = queryInfo.keyPath;
        var deletedKeys = change.keys;
        return state.filter(function (value) {
          return !deletedKeys.includes(value[_keyPath]);
        });
      }

    case 'updated':
      {
        var _keyPath2 = queryInfo.keyPath;
        var newState = copy(state);
        change.result.forEach(function (newObject) {
          var index = newState.findIndex(function (o) {
            return o[_keyPath2] === newObject[_keyPath2];
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


function applyCollectionChanges(state, changes, queryMeta, queryInfo) {
  if (state === undefined) return {
    state: state,
    meta: queryMeta
  };

  var newQueryMeta = _extends({}, queryMeta);

  return {
    // eslint-disable-next-line unicorn/no-array-reduce
    state: changes.reduce(function (result, change) {
      return applyCollectionChange(result, change, queryMeta, queryInfo);
    }, state),
    meta: newQueryMeta
  };
}

var applySingleItemChange = function applySingleItemChange(state, change, queryMeta) {
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
    state: state,
    meta: queryMeta
  };

  var newQueryMeta = _extends({}, queryMeta);

  return {
    // eslint-disable-next-line unicorn/no-array-reduce
    state: changes.reduce(function (result, change) {
      return applySingleItemChange(result, change, queryMeta);
    }, state),
    meta: newQueryMeta
  };
}

/* eslint-disable max-lines */
var defaultOptions = {
  visibleTimeout: 120000 // 2 minutes

};
var logger = new Logger('react-liwi:useResourceAndSubscribe');

var isInitial = function isInitial(changes) {
  return changes.length === 1 && changes[0].type === 'initial';
};

function useRetrieveResourceAndSubscribe(createQuery, params, skip, deps, _temp) {
  var _ref = _temp === void 0 ? defaultOptions : _temp,
      visibleTimeout = _ref.visibleTimeout;

  var querySubscriptionRef = useRef(undefined);
  var timeoutRef = useRef(undefined);
  var changeParamsRef = useRef(undefined);
  var handleVisibilityChangeRef = useRef(undefined);
  var skipRef = useRef(skip);
  skipRef.current = skip;

  var unsubscribe = function unsubscribe() {
    logger.info('unsubscribe'); // reset timeout to allow resubscribing

    timeoutRef.current = undefined;

    if (querySubscriptionRef.current) {
      querySubscriptionRef.current.stop();
      querySubscriptionRef.current = undefined;
    }
  };

  var _useReducer = useReducer(reducer, function () {
    var query = createQuery(params);
    var applyChanges;
    var currentResult;
    var currentMeta;
    var currentQueryInfo;
    return {
      query: query,
      promise: new Promise(function () {
        var queryLogger = logger.context({
          resourceName: query.resourceName,
          key: query.key
        });
        queryLogger.debug('init');

        var subscribe = function subscribe() {
          queryLogger.debug('subscribing', {
            querySubscriptionRef: querySubscriptionRef.current,
            timeoutRef: timeoutRef.current
          });
          querySubscriptionRef.current = query.fetchAndSubscribe(function (err, changes) {
            var _applyChanges, newResult, newMeta;

            queryLogger.debug('received changes', {
              err: err,
              changes: changes
            });

            if (err) {
              dispatch({
                type: 'error',
                error: err
              });
              return;
            }

            if (!currentResult && isInitial(changes)) {
              var initialChange = changes[0];
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
              _applyChanges = applyChanges(currentResult, changes, currentMeta, currentQueryInfo), newResult = _applyChanges.state, newMeta = _applyChanges.meta;

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
          querySubscriptionRef.current.then(function () {
            queryLogger.success('subscribed');
          }, function (err) {
            dispatch({
              type: 'error',
              error: err
            });
          });
        };

        changeParamsRef.current = function (changedParams) {
          queryLogger.info('change params', {
            skip: skipRef.current,
            params: changedParams
          });

          if (querySubscriptionRef.current) {
            querySubscriptionRef.current.stop();
          }

          query.changeParams(changedParams);

          if (!document.hidden && !skipRef.current) {
            dispatch({
              type: 'fetching'
            });
            subscribe();
          }
        };

        var handleVisibilityChange = function handleVisibilityChange() {
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
  }, initReducer),
      state = _useReducer[0],
      dispatch = _useReducer[1];

  var firstEffectChangeParams = useRef(false);
  useEffect(function () {
    if (!firstEffectChangeParams.current) {
      firstEffectChangeParams.current = true;
      return;
    }

    if (changeParamsRef.current) {
      changeParamsRef.current(params);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [skip].concat(deps));
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
  return useMemo(function () {
    return createResourceResultFromState(state);
  }, [state]);
}

var isSSR = typeof window === 'undefined';
function useResource(createQuery, _ref, deps) {
  var params = _ref.params,
      _ref$skip = _ref.skip,
      skip = _ref$skip === void 0 ? false : _ref$skip,
      subscribe = _ref.subscribe,
      subscribeOptions = _ref.subscribeOptions;
  var result = subscribe && !isSSR ? // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResourceAndSubscribe(createQuery, params, skip, deps, subscribeOptions) : // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResource(createQuery, params, skip, deps);
  return result;
}

function usePaginatedResource(createQuery, options, deps) {
  var _result$meta, _result$queryInfo;

  var result = useResource(createQuery, options, deps);
  var total = (_result$meta = result.meta) == null ? void 0 : _result$meta.total;
  var limit = (_result$queryInfo = result.queryInfo) == null ? void 0 : _result$queryInfo.limit;
  var pagination = useMemo(function () {
    if (total === undefined) return undefined;
    return {
      totalPages: limit ? Math.ceil(total / limit) : 1
    };
  }, [total, limit]);
  return useMemo(function () {
    return _extends({}, result, {
      pagination: pagination
    });
  }, [result, pagination]);
}

function useOperation(operationCall) {
  var _useState = useState(function () {
    return {
      loading: false,
      error: undefined
    };
  }),
      state = _useState[0],
      setState = _useState[1];

  var operationCallWrapper = useCallback(function () {
    var _len, params, _key;

    setState({
      loading: true,
      error: undefined
    });

    try {
      for (_len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return operationCall.apply(void 0, params).then(function (result) {
        setState({
          loading: false,
          error: undefined
        });
        return [undefined, result];
      }, function (err) {
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

// eslint-disable-next-line complexity
var transportClientStateToSimplifiedState = function transportClientStateToSimplifiedState(state) {
  switch (state) {
    case 'opening':
    case 'connecting':
    case 'reconnect-scheduled':
    case 'wait-for-visibility':
      return 'connecting';

    case 'connected':
      return 'connected';

    case 'closed':
      return 'disconnected';
  }
};

export { TransportClientContext, TransportClientProvider, TransportClientReadyContext, TransportClientStateContext, transportClientStateToSimplifiedState, useOperation, usePaginatedResource, useResource, useTransportClientIsReady, useTransportClientState };
//# sourceMappingURL=index-browser.es.js.map
