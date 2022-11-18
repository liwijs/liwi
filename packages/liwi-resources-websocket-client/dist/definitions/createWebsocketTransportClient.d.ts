import type { TransportClient } from 'liwi-resources-client';
import type { SimpleWebsocketClientOptions } from './createSimpleWebsocketClient';
export type WebsocketTransportClientOptions = Omit<SimpleWebsocketClientOptions, 'onMessage' | 'url'> & Partial<Pick<SimpleWebsocketClientOptions, 'url'>>;
export default function createResourcesWebsocketClient({ url, ...options }: WebsocketTransportClientOptions): TransportClient;
//# sourceMappingURL=createWebsocketTransportClient.d.ts.map