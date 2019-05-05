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
  var _useReducer = useReducer(reducer, function () {
    return createQuery().fetch(function (result) {
      state.resolve();
      dispatch({
        type: 'resolve',
        result: result
      });
    });
  }, initReducer),
      state = _useReducer[0],
      dispatch = _useReducer[1];

  return state;
}

/* eslint-disable camelcase, complexity */
var copy = function copy(state) {
  return state.slice();
};

var applyChange = function applyChange(state, change, keyPath) {
  switch (change.type) {
    case 'initial':
      return change.initial;

    case 'inserted':
      {
        return [].concat(change.objects, state.slice(0, -change.objects.length));
      }

    case 'deleted':
      {
        var deletedKeys = change.keys;
        return state.filter(function (value) {
          return !deletedKeys.includes(value[keyPath]);
        });
      }

    case 'updated':
      {
        var newState = copy(state);
        change.objects.forEach(function (newObject) {
          var index = newState.findIndex(function (o) {
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


var applyChanges = (function (state, changes, keyPath) {
  if (changes.length === 1) {
    var firstChange = changes[0];

    if (firstChange.type === 'initial') {
      return firstChange.initial;
    }
  }

  if (state === undefined) return state;
  return changes.reduce(function (stateValue, change) {
    return applyChange(stateValue, change, keyPath);
  }, state);
});

var defaultOptions = {
  visibleTimeout: 120000 // 2 minutes

};
var logger = new Logger('react-liwi:useResourceAndSubscribe');
function useRetrieveResourceAndSubscribe(createQuery, _temp) {
  var _ref = _temp === void 0 ? defaultOptions : _temp,
      visibleTimeout = _ref.visibleTimeout;

  var subscribeResultRef = useRef(undefined);
  var timeoutRef = useRef(undefined);
  var resultRef = useRef(undefined);

  var unsubscribe = function unsubscribe() {
    logger.log('unsubscribe'); // reset timeout to allow resubscribing

    timeoutRef.current = undefined;
    resultRef.current = undefined;

    if (subscribeResultRef.current) {
      subscribeResultRef.current.stop();
      subscribeResultRef.current = undefined;
    }
  };

  var _useReducer = useReducer(reducer, function () {
    return new Promise(function () {
      var query = createQuery();
      var queryLogger = logger.context({
        resourceName: query.client.resourceName,
        key: query.key
      });
      queryLogger.debug('init');

      var subscribe = function subscribe() {
        queryLogger.debug('subscribing', {
          subscribeResultRef: subscribeResultRef.current,
          timeoutRef: timeoutRef.current
        });
        subscribeResultRef.current = query.fetchAndSubscribe(function (err, changes) {
          queryLogger.debug('received changes', {
            err: err,
            changes: changes
          });

          if (err) {
            // eslint-disable-next-line no-alert
            alert("Unexpected error: " + err);
            return;
          }

          var currentResult = resultRef.current;
          var newResult = applyChanges(currentResult, changes, '_id' // TODO get keyPath from client(/store)
          );

          if (newResult && newResult !== currentResult) {
            resultRef.current = newResult;
            dispatch({
              type: 'resolve',
              result: newResult
            });
          }
        });
      };

      document.addEventListener('visibilitychange', function handleVisibilityChange() {
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
      }, false);

      if (!document.hidden) {
        subscribe();
      }
    });
  }, initReducer),
      state = _useReducer[0],
      dispatch = _useReducer[1];

  useEffect(function () {
    return function () {
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
  var states = createQueries.map(function (createQuery, index) {
    return queriesToSubscribe[index] ? // eslint-disable-next-line react-hooks/rules-of-hooks
    useRetrieveResourceAndSubscribe(createQuery) : // eslint-disable-next-line react-hooks/rules-of-hooks
    useRetrieveResource(createQuery);
  });
  var nonFetchedStates = states.filter(function (state) {
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
  var state = subscribe ? // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResourceAndSubscribe(createQuery) : // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResource(createQuery);

  if (!state.fetched) {
    return [true, undefined];
  }

  return [false, state.result];
}

export { useResource, useResources };
//# sourceMappingURL=index-browser.es.js.map
