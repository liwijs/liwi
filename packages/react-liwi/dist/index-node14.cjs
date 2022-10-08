'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const react = require('react');
const jsxRuntime = require('react/jsx-runtime');
const liwiResourcesClient = require('liwi-resources-client');

function useResource(createQuery, {
  params,
  skip = false,
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
  const result = useResource(createQuery, options);
  const total = result.meta?.total;
  const limit = result.queryInfo?.limit;
  const pagination = react.useMemo(() => {
    if (total === undefined) return undefined;
    return {
      totalPages: limit ? Math.ceil(total / limit) : 1
    };
  }, [total, limit]);
  return react.useMemo(() => ({ ...result,
    pagination
  }), [result, pagination]);
}

function useOperation(operationCall) {
  const [state, setState] = react.useState(() => ({
    loading: false,
    error: undefined
  }));
  const operationCallWrapper = react.useCallback((...params) => {
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

const TransportClientContext = /*#__PURE__*/react.createContext(undefined);
const TransportClientStateContext = /*#__PURE__*/react.createContext('opening');
const TransportClientReadyContext = /*#__PURE__*/react.createContext(false);
const useTransportClientState = () => react.useContext(TransportClientStateContext);
const useTransportClientIsReady = () => react.useContext(TransportClientReadyContext);
function TransportClientProvider({
  createFn,
  children,
  ...params
}) {
  const [client] = react.useState(() => {
    return createFn(params);
  });
  const [connectionState, setConnectionState] = react.useState('opening');
  react.useEffect(() => {
    const closeConnectionStateListener = client.listenStateChange(setConnectionState);
    client.connect();
    return () => {
      closeConnectionStateListener();
      client.close();
    };
  }, [client]);
  return /*#__PURE__*/jsxRuntime.jsx(TransportClientContext.Provider, {
    value: client,
    children: /*#__PURE__*/jsxRuntime.jsx(TransportClientStateContext.Provider, {
      value: connectionState,
      children: /*#__PURE__*/jsxRuntime.jsx(TransportClientReadyContext.Provider, {
        value: connectionState === 'connected',
        children: children
      })
    })
  });
}

const transportClientStateToSimplifiedState = state => {
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

exports.ResourcesServerError = liwiResourcesClient.ResourcesServerError;
exports.TransportClientContext = TransportClientContext;
exports.TransportClientProvider = TransportClientProvider;
exports.TransportClientReadyContext = TransportClientReadyContext;
exports.TransportClientStateContext = TransportClientStateContext;
exports.transportClientStateToSimplifiedState = transportClientStateToSimplifiedState;
exports.useOperation = useOperation;
exports.usePaginatedResource = usePaginatedResource;
exports.useResource = useResource;
exports.useTransportClientIsReady = useTransportClientIsReady;
exports.useTransportClientState = useTransportClientState;
//# sourceMappingURL=index-node14.cjs.map
