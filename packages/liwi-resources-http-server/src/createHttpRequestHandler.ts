import type {
  IncomingMessage,
  OutgoingHttpHeaders,
  ServerResponse,
} from "node:http";
import { decode, encode } from "extended-json";
import type { ExtendedJsonValue } from "extended-json";
import type {
  AckError,
  ResourcesServerService,
  ToClientHttpResponse,
  ToServerHttpRequest,
  ToServerMessage,
} from "liwi-resources-server";
import {
  ResourcesServerError,
  createMessageHandler,
} from "liwi-resources-server";
import { Logger } from "nightingale-logger";

const logger = new Logger("liwi:resources-http-server");

const DEFAULT_MAX_BODY_SIZE = 1024 * 1024;

const HTTP_REQUEST_TYPES = new Set<string>(["do", "fetch"]);

const INTERNAL_SERVER_ERROR: AckError = {
  code: "INTERNAL_SERVER_ERROR",
  message: "Internal Server Error",
};

interface RequestFailure {
  statusCode: number;
  error: AckError;
  headers?: OutgoingHttpHeaders;
}

type Checked<T> =
  | { ok: false; failure: RequestFailure }
  | { ok: true; value: T };

const METHOD_NOT_ALLOWED: RequestFailure = {
  statusCode: 405,
  error: { code: "METHOD_NOT_ALLOWED", message: "Only POST is allowed" },
  headers: { allow: "POST" },
};

const UNSUPPORTED_MEDIA_TYPE: RequestFailure = {
  statusCode: 415,
  error: {
    code: "UNSUPPORTED_MEDIA_TYPE",
    message: "Content-Type must be application/json",
  },
};

const PAYLOAD_TOO_LARGE: RequestFailure = {
  statusCode: 413,
  error: { code: "PAYLOAD_TOO_LARGE", message: "Request body is too large" },
  headers: { connection: "close" },
};

const INVALID_MESSAGE: RequestFailure = {
  statusCode: 400,
  error: {
    code: "INVALID_MESSAGE",
    message: 'Expected a ["do" | "fetch", payload] tuple',
  },
};

type GetAuthenticatedUser<AuthenticatedUser> = (
  request: IncomingMessage,
) => AuthenticatedUser | Promise<AuthenticatedUser | null> | null;

export interface HttpRequestHandlerOptions<AuthenticatedUser> {
  resourcesServerService: ResourcesServerService;
  /** Called on every request. If it throws, the request proceeds with `null`. */
  getAuthenticatedUser: GetAuthenticatedUser<AuthenticatedUser>;
  /** Largest accepted request body, in bytes. Defaults to 1 MiB. */
  maxBodySize?: number;
}

export type HttpRequestHandler = (
  request: IncomingMessage,
  response: ServerResponse,
) => void;

const sendResponse = (
  response: ServerResponse,
  statusCode: number,
  body: ToClientHttpResponse,
  headers?: OutgoingHttpHeaders,
): void => {
  response.writeHead(statusCode, {
    ...headers,
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(encode(body));
};

const sendFailure = (
  response: ServerResponse,
  { statusCode, error, headers }: RequestFailure,
): void => {
  sendResponse(response, statusCode, [error, null], headers);
};

const isJsonContentType = (contentType: string | undefined): boolean =>
  contentType?.split(";")[0]?.trim().toLowerCase() === "application/json";

const readBody = (
  request: IncomingMessage,
  maxBodySize: number,
): Promise<Checked<string>> => {
  if (request.readableEnded) {
    // waiting for "end" on an already consumed stream would hang forever
    return Promise.reject(
      new Error(
        "Request body already consumed: do not put a body parser in front of this handler",
      ),
    );
  }

  if (Number(request.headers["content-length"]) > maxBodySize) {
    return Promise.resolve({ ok: false, failure: PAYLOAD_TOO_LARGE });
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;

    const onData = (chunk: Buffer): void => {
      size += chunk.length;
      if (size > maxBodySize) {
        request.off("data", onData);
        resolve({ ok: false, failure: PAYLOAD_TOO_LARGE });
        return;
      }
      chunks.push(chunk);
    };

    request.on("data", onData);
    request.on("end", () => {
      resolve({ ok: true, value: Buffer.concat(chunks).toString("utf8") });
    });
    request.on("error", reject);
  });
};

const isHttpRequest = (value: unknown): value is ToServerHttpRequest =>
  Array.isArray(value) &&
  value.length === 2 &&
  HTTP_REQUEST_TYPES.has(value[0] as string) &&
  typeof value[1] === "object" &&
  value[1] !== null;

const parseHttpRequest = (body: string): Checked<ToServerHttpRequest> => {
  let decoded: unknown;
  try {
    decoded = decode<unknown>(body);
  } catch {
    return { ok: false, failure: INVALID_MESSAGE };
  }
  if (!isHttpRequest(decoded)) return { ok: false, failure: INVALID_MESSAGE };
  return { ok: true, value: decoded };
};

const checkRequestHeaders = (request: IncomingMessage): Checked<null> => {
  if (request.method !== "POST") {
    return { ok: false, failure: METHOD_NOT_ALLOWED };
  }
  // a non-simple content type forces a CORS preflight, which protects
  // cookie-authenticated operations from cross-site requests
  if (!isJsonContentType(request.headers["content-type"])) {
    return { ok: false, failure: UNSUPPORTED_MEDIA_TYPE };
  }
  return { ok: true, value: null };
};

export const createHttpRequestHandler = <AuthenticatedUser>({
  resourcesServerService,
  getAuthenticatedUser,
  maxBodySize = DEFAULT_MAX_BODY_SIZE,
}: HttpRequestHandlerOptions<AuthenticatedUser>): HttpRequestHandler => {
  const resolveAuthenticatedUser = async (
    request: IncomingMessage,
  ): Promise<AuthenticatedUser | null> => {
    try {
      return await getAuthenticatedUser(request);
    } catch (error: unknown) {
      logger.warn("getAuthenticatedUser threw an error, return null instead.", {
        error,
      });
      return null;
    }
  };

  const handleMessage = async (
    [type, payload]: ToServerHttpRequest,
    authenticatedUser: AuthenticatedUser | null,
  ): Promise<{ statusCode: number; body: ToClientHttpResponse }> => {
    const { messageHandler } = createMessageHandler(
      resourcesServerService,
      authenticatedUser,
      false,
    );

    try {
      const result = await messageHandler(
        { type, id: 0, payload } as ToServerMessage,
        () => {},
      );
      return { statusCode: 200, body: [null, result as ExtendedJsonValue] };
    } catch (error: unknown) {
      if (error instanceof ResourcesServerError) {
        return {
          statusCode: 400,
          body: [{ code: error.code, message: error.message }, null],
        };
      }
      return { statusCode: 500, body: [INTERNAL_SERVER_ERROR, null] };
    }
  };

  const handleRequest = async (
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> => {
    const headersCheck = checkRequestHeaders(request);
    if (!headersCheck.ok) {
      sendFailure(response, headersCheck.failure);
      return;
    }

    const body = await readBody(request, maxBodySize);
    if (!body.ok) {
      sendFailure(response, body.failure);
      return;
    }

    const httpRequest = parseHttpRequest(body.value);
    if (!httpRequest.ok) {
      sendFailure(response, httpRequest.failure);
      return;
    }

    logger.debug("received", { type: httpRequest.value[0] });
    const authenticatedUser = await resolveAuthenticatedUser(request);
    const { statusCode, body: responseBody } = await handleMessage(
      httpRequest.value,
      authenticatedUser,
    );
    sendResponse(response, statusCode, responseBody);
  };

  return (request, response) => {
    handleRequest(request, response).catch((error: unknown) => {
      logger.error("unexpected error", { error });
      if (response.headersSent) {
        response.end();
      } else {
        sendResponse(response, 500, [INTERNAL_SERVER_ERROR, null]);
      }
    });
  };
};
