import type { TransportClient } from 'liwi-resources-client';
import { SimpleWebsocketClientOptions } from './createSimpleWebsocketClient';
export declare type WebsocketTransportClientOptions = Omit<SimpleWebsocketClientOptions, 'onMessage' | 'url'> & Partial<Pick<SimpleWebsocketClientOptions, 'url'>>;
export default function createResourcesWebsocketClient({ url, ...options }: WebsocketTransportClientOptions): TransportClient;
//# sourceMappingURL=createWebsocketTransportClient.d.ts.map