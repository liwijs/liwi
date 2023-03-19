/// <reference types="node" />
import type http from 'http';
import type { ResourcesServerService } from 'liwi-resources-server';
import { WebSocketServer } from 'ws';
type GetAuthenticatedUser<AuthenticatedUser> = (request: http.IncomingMessage) => AuthenticatedUser | Promise<AuthenticatedUser | null> | null;
export interface ResourcesWebsocketServer {
    wss: WebSocketServer;
    close: () => void;
}
export declare const createWsServer: <AuthenticatedUser>(server: http.Server, path: string, resourcesServerService: ResourcesServerService, getAuthenticatedUser: GetAuthenticatedUser<AuthenticatedUser>) => ResourcesWebsocketServer;
export {};
//# sourceMappingURL=index.d.ts.map