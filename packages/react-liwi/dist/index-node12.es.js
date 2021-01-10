import React, { useMemo, useState, useCallback, createContext, useEffect } from 'react';

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
  var _result$meta, _result$queryInfo;

  const result = useResource(createQuery, options);
  const total = (_result$meta = result.meta) === null || _result$meta === void 0 ? void 0 : _result$meta.total;
  const limit = (_result$queryInfo = result.queryInfo) === null || _result$queryInfo === void 0 ? void 0 : _result$queryInfo.limit;
  const pagination = useMemo(() => {
    if (total === undefined) return undefined;
    return {
      totalPages: limit ? Math.ceil(total / limit) : 1
    };
  }, [total, limit]);
  return useMemo(() => ({ ...result,
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

const TransportClientContext = /*#__PURE__*/createContext(undefined);
const TransportClientStateContext = /*#__PURE__*/createContext('opening');
const TransportClientReadyContext = /*#__PURE__*/createContext(false);
function TransportClientProvider({
  createFn,
  children,
  ...params
}) {
  const [client] = useState(() => {
    return createFn(params);
  });
  const [connectionState, setConnectionState] = useState('opening');
  useEffect(() => {
    const closeConnectionStateListener = client.listenStateChange(setConnectionState);
    client.connect();
    return () => {
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

export { TransportClientContext, TransportClientProvider, TransportClientReadyContext, TransportClientStateContext, useOperation, usePaginatedResource, useResource };
//# sourceMappingURL=index-node12.es.js.map
