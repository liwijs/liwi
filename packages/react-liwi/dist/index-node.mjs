import { useMemo, useState, useCallback, createContext, useContext, useEffect } from 'react';
import { jsx } from 'react/jsx-runtime';
export { ResourcesServerError } from 'liwi-resources-client';

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
//# sourceMappingURL=index-node.mjs.map
