/// <reference types="node" />
import type http from 'http';
import type { ResourcesServerService } from 'liwi-resources-server';
import WebSocket from 'ws';
export declare type WebsocketServer = WebSocket.Server;
declare type GetAuthenticatedUser<AuthenticatedUser> = (request: http.IncomingMessage) => AuthenticatedUser | null | Promise<AuthenticatedUser | null>;
export interface ResourcesWebsocketServer {
    wss: WebSocket.Server;
    close: () => void;
}
export declare const createWsServer: <AuthenticatedUser>(server: http.Server, path: string | undefined, resourcesServerService: ResourcesServerService, getAuthenticatedUser: GetAuthenticatedUser<AuthenticatedUser>) => ResourcesWebsocketServer;
export {};
//# sourceMappingURL=index.d.ts.map