import React, { createContext, useState, useEffect, useContext, useRef, useReducer, useMemo, useCallback } from 'react';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import Logger from 'nightingale-logger';
import { Lazy } from 'mingo/lazy';
import { $sort } from 'mingo/operators/pipeline';

const TransportClientContext = /*#__PURE__*/createContext(undefined);
const TransportClientStateContext = /*#__PURE__*/createContext('opening');
const TransportClientReadyContext = /*#__PURE__*/createContext(false);
function TransportClientProvider(_ref) {
  let {
    createFn,
    children
  } = _ref,
      params = _objectWithoutPropertiesLoose(_ref, ["createFn", "children"]);

  const [client] = useState(function () {
    return createFn(params);
  });
  const [connectionState, setConnectionState] = useState('opening');
  useEffect(function () {
    const closeConnectionStateListener = client.listenStateChange(setConnectionState);
    client.connect();
    return function () {
      closeConnectionStateListener();
      client.close();
    };
  }, [client]);
  return /*#__PURE__*/React.createElement(TransportClientContext.Provider, {
    value: client
  }, /*#__PURE__*/React.createElement(TransportClientStateContext.Provider, {
    value: connectionState
  }, /*#__PURE__*/React.createElement(TransportClientReadyContext.Provider, {
    value: connectionState === 'connected'
  }, children)));
}

const createResourceResultFromState = function createResourceResultFromState(state) {
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
      return Object.assign({}, state, {
        fetching: true
      });

    case 'error':
      return Object.assign({}, state, {
        fetching: false,
        error: action.error
      });

    default:
      throw new Error('Invalid action');
  }
}

function useRetrieveResource(createQuery, params, deps) {
  const isTransportReady = useContext(TransportClientReadyContext);
  const wasReady = useRef(isTransportReady);
  const currentFetchId = useRef(0);

  const fetch = function fetch(query, callback) {
    const fetchId = ++currentFetchId.current;
    return query.fetch(function (result) {
      if (currentFetchId.current === fetchId) {
        callback(result);
      }
    });
  };

  const [state, dispatch] = useReducer(reducer, function () {
    const query = createQuery(params);
    if (!isTransportReady) return {
      query
    };
    return {
      query,
      promise: fetch(query, function ({
        result,
        meta,
        info
      }) {
        dispatch({
          type: 'resolve',
          result,
          meta,
          queryInfo: info
        });
      }).catch(function (err) {
        dispatch({
          type: 'error',
          error: err
        });
      })
    };
  }, initReducer);
  useEffect(function () {
    if (wasReady.current) return;
    if (!isTransportReady) return;
    wasReady.current = true;
    dispatch({
      type: 'refetch',
      promise: fetch(state.query, function ({
        result,
        meta,
        info
      }) {
        dispatch({
          type: 'resolve',
          result,
          meta,
          queryInfo: info
        });
      }).catch(function (err) {
        dispatch({
          type: 'error',
          error: err
        });
      })
    });
  }, [isTransportReady, state.query]);
  const firstEffectChangeParams = useRef(false);
  useEffect(function () {
    if (firstEffectChangeParams.current === false) {
      firstEffectChangeParams.current = true;
      return;
    }

    state.query.changeParams(params);
    if (!wasReady.current) return;
    dispatch({
      type: 'refetch',
      promise: fetch(state.query, function ({
        result,
        meta,
        info
      }) {
        dispatch({
          type: 'resolve',
          result,
          meta,
          queryInfo: info
        });
      }).catch(function (err) {
        dispatch({
          type: 'error',
          error: err
        });
      })
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.query, ...deps]);
  return createResourceResultFromState(state);
}

/* eslint-disable camelcase, complexity */

function sortCollection(collection, sort) {
  return $sort(Lazy(collection), sort, {
    config: {
      idKey: '_id'
    }
  }).value();
}

const copy = function copy(state) {
  return state.slice();
};

const applyCollectionChange = function applyCollectionChange(state, change, queryMeta, queryInfo) {
  switch (change.type) {
    case 'initial':
      return change.initial;

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
        return state.filter(function (value) {
          return !deletedKeys.includes(value[keyPath]);
        });
      }

    case 'updated':
      {
        const keyPath = queryInfo.keyPath;
        const newState = copy(state);
        change.result.forEach(function (newObject) {
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


function applyCollectionChanges(state, changes, queryMeta, queryInfo) {
  if (state === undefined) return {
    state,
    meta: queryMeta
  };
  const newQueryMeta = Object.assign({}, queryMeta);
  return {
    state: changes.reduce(function (result, change) {
      return applyCollectionChange(result, change, queryMeta, queryInfo);
    }, state),
    meta: newQueryMeta
  };
}

/* eslint-disable camelcase, complexity */
const applySingleItemChange = function applySingleItemChange(state, change, queryMeta) {
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
  const newQueryMeta = Object.assign({}, queryMeta);
  return {
    state: changes.reduce(function (result, change) {
      return applySingleItemChange(result, change, queryMeta);
    }, state),
    meta: newQueryMeta
  };
}

/* eslint-disable max-lines */
const defaultOptions = {
  visibleTimeout: 120000 // 2 minutes

};
const logger = new Logger('react-liwi:useResourceAndSubscribe');

const isInitial = function isInitial(changes) {
  return changes.length === 1 && changes[0].type === 'initial';
};

function useRetrieveResourceAndSubscribe(createQuery, params, deps, {
  visibleTimeout
} = defaultOptions) {
  const querySubscriptionRef = useRef(undefined);
  const timeoutRef = useRef(undefined);
  const changeParamsRef = useRef(undefined);
  const handleVisibilityChangeRef = useRef(undefined);

  const unsubscribe = function unsubscribe() {
    logger.info('unsubscribe'); // reset timeout to allow resubscribing

    timeoutRef.current = undefined;

    if (querySubscriptionRef.current) {
      querySubscriptionRef.current.stop();
      querySubscriptionRef.current = undefined;
    }
  };

  const [state, dispatch] = useReducer(reducer, function () {
    const query = createQuery(params);
    let applyChanges;
    let currentResult;
    let currentMeta;
    let currentQueryInfo;
    return {
      query,
      promise: new Promise(function () {
        const queryLogger = logger.context({
          resourceName: query.resourceName,
          key: query.key
        });
        queryLogger.debug('init');

        const subscribe = function subscribe() {
          queryLogger.debug('subscribing', {
            querySubscriptionRef: querySubscriptionRef.current,
            timeoutRef: timeoutRef.current
          });
          querySubscriptionRef.current = query.fetchAndSubscribe(function (err, changes) {
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
          querySubscriptionRef.current.then(function () {
            queryLogger.success('subscribed');
          }, function (error) {
            dispatch({
              type: 'error',
              error
            });
          });
        };

        changeParamsRef.current = function (params) {
          queryLogger.info('change params', {
            params
          });

          if (querySubscriptionRef.current) {
            querySubscriptionRef.current.stop();
          }

          query.changeParams(params);

          if (!document.hidden) {
            dispatch({
              type: 'fetching'
            });
            subscribe();
          }
        };

        const handleVisibilityChange = function handleVisibilityChange() {
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
  const firstEffectChangeParams = useRef(false);
  useEffect(function () {
    if (firstEffectChangeParams.current === false) {
      firstEffectChangeParams.current = true;
      return;
    }

    if (changeParamsRef.current) {
      changeParamsRef.current(params);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, deps);
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

function useResource(createQuery, {
  params,
  subscribe,
  subscribeOptions
}, deps) {
  const result = subscribe ? // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResourceAndSubscribe(createQuery, params, deps, subscribeOptions) : // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResource(createQuery, params, deps);
  return result;
}

function usePaginatedResource(createQuery, options, deps) {
  var _result$meta, _result$queryInfo;

  const result = useResource(createQuery, options, deps);
  const total = (_result$meta = result.meta) === null || _result$meta === void 0 ? void 0 : _result$meta.total;
  const limit = (_result$queryInfo = result.queryInfo) === null || _result$queryInfo === void 0 ? void 0 : _result$queryInfo.limit;
  const pagination = useMemo(function () {
    if (total === undefined) return undefined;
    return {
      totalPages: limit ? Math.ceil(total / limit) : 1
    };
  }, [total, limit]);
  return useMemo(function () {
    return Object.assign({}, result, {
      pagination
    });
  }, [result, pagination]);
}

function useOperation(operationCall) {
  const [state, setState] = useState(function () {
    return {
      loading: false,
      error: undefined
    };
  });
  const operationCallWrapper = useCallback(function (...params) {
    setState({
      loading: true,
      error: undefined
    });

    try {
      return operationCall(...params).then(function (result) {
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

export { TransportClientContext, TransportClientProvider, TransportClientReadyContext, TransportClientStateContext, useOperation, usePaginatedResource, useResource };
//# sourceMappingURL=index-browsermodern.es.js.map
