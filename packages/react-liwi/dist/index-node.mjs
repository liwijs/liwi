import { useMemo, useState, useCallback, createContext, useContext, useEffect } from 'react';
import { jsx } from 'react/jsx-runtime';
export { ResourcesServerError } from 'liwi-resources-client';

function useResource(createQuery, options, deps) {
  return {
    query: void 0,
    initialLoading: true,
    initialError: false,
    fetched: false,
    fetching: true,
    data: void 0,
    meta: void 0,
    queryInfo: void 0,
    error: void 0
  };
}

function usePaginatedResource(createQuery, options, deps) {
  const result = useResource();
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
//# sourceMappingURL=index-node.mjs.map
