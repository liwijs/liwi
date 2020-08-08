import type { TransportClient } from 'liwi-resources-client';
import { SimpleWebsocketClientOptions } from './createSimpleWebsocketClient';
export declare type WebsocketTransportClientOptions = Omit<SimpleWebsocketClientOptions, 'onMessage'>;
export default function createResourcesWebsocketClient(options: WebsocketTransportClientOptions): TransportClient;
//# sourceMappingURL=createWebsocketTransportClient.d.ts.map