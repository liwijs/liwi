'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const React = require('react');
const React__default = _interopDefault(React);

function useResource(createQuery, {
  params,
  subscribe,
  subscribeOptions
}, deps) {
  return {
    query: undefined,
    initialLoading: true,
    initialError: false,
    fetched: false,
    fetching: true,
    data: undefined,
    meta: undefined,
    queryInfo: undefined,
    error: undefined
  };
}

function usePaginatedResource(createQuery, options, deps) {
  var _result$meta, _result$queryInfo;

  const result = useResource(createQuery, options);
  const total = (_result$meta = result.meta) === null || _result$meta === void 0 ? void 0 : _result$meta.total;
  const limit = (_result$queryInfo = result.queryInfo) === null || _result$queryInfo === void 0 ? void 0 : _result$queryInfo.limit;
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

exports.TransportClientContext = TransportClientContext;
exports.TransportClientProvider = TransportClientProvider;
exports.TransportClientReadyContext = TransportClientReadyContext;
exports.TransportClientStateContext = TransportClientStateContext;
exports.useOperation = useOperation;
exports.usePaginatedResource = usePaginatedResource;
exports.useResource = useResource;
//# sourceMappingURL=index-node10.cjs.js.map
