import { decode, encode } from "extended-json";
import type { ExtendedJsonValue } from "extended-json";
import { ResourcesServerError } from "liwi-resources-client";
import type {
  ConnectionStateChangeListener,
  ConnectionStates,
  ToClientHttpResponse,
  ToServerHttpRequest,
  TransportClient,
} from "liwi-resources-client";

type HeadersProvider = () => HeadersInit | Promise<HeadersInit>;

export interface HttpTransportClientOptions {
  /** Endpoint served by `liwi-resources-http-server`. May be relative in a browser. */
  url: string;
  /** Request headers, or a function evaluated before every request. */
  headers?: HeadersInit | HeadersProvider;
  credentials?: RequestCredentials;
  fetch?: typeof globalThis.fetch;
}

export class HttpTransportError extends Error {
  status: number;

  constructor(response: Response) {
    super(
      `Unexpected HTTP response: ${response.status} ${response.statusText}`,
    );
    this.name = "HttpTransportError";
    this.status = response.status;
  }
}

export const isHttpTransportError = (
  error: unknown,
): error is HttpTransportError => error instanceof HttpTransportError;

const isHttpResponse = (value: unknown): value is ToClientHttpResponse =>
  Array.isArray(value) && value.length === 2;

const parseResponse = async (
  response: Response,
): Promise<ToClientHttpResponse> => {
  const text = await response.text();
  try {
    const decoded = decode<unknown>(text);
    if (isHttpResponse(decoded)) return decoded;
  } catch {}
  throw new HttpTransportError(response);
};

// browsers throw "Illegal invocation" when fetch is called detached from globalThis
const callGlobalFetch: typeof globalThis.fetch = (input, init) =>
  globalThis.fetch(input, init);

export const createHttpTransportClient = ({
  url,
  headers,
  credentials,
  fetch = callGlobalFetch,
}: HttpTransportClientOptions): TransportClient => {
  let state: ConnectionStates = "closed";
  let abortController = new AbortController();
  const stateChangeListeners = new Set<ConnectionStateChangeListener>();

  const setState = (newState: ConnectionStates): void => {
    if (state === newState) return;
    state = newState;
    stateChangeListeners.forEach((listener) => {
      listener(newState);
    });
  };

  const resolveHeaders = async (): Promise<Headers> => {
    const resolvedHeaders = new Headers(
      typeof headers === "function" ? await headers() : headers,
    );
    resolvedHeaders.set("content-type", "application/json");
    return resolvedHeaders;
  };

  const sendRequest = async (
    ...httpRequest: ToServerHttpRequest
  ): Promise<ExtendedJsonValue> => {
    const response = await fetch(url, {
      method: "POST",
      headers: await resolveHeaders(),
      body: encode(httpRequest as unknown as ExtendedJsonValue),
      credentials,
      signal: abortController.signal,
    });
    const [error, result] = await parseResponse(response);
    if (error) throw new ResourcesServerError(error.code, error.message);
    return result;
  };

  return {
    connect: () => {
      setState("connected");
    },
    close: () => {
      abortController.abort();
      abortController = new AbortController();
      setState("closed");
    },
    listenStateChange: (listener) => {
      stateChangeListeners.add(listener);
      return (): void => {
        stateChangeListeners.delete(listener);
      };
    },
    send: sendRequest as TransportClient["send"],
    subscribe: () => {
      throw new Error("HTTP transport does not support subscriptions");
    },
  };
};
