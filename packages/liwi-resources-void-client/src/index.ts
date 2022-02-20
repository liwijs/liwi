import type { TransportClient } from 'liwi-resources-client';
import type { ResourcesServerService } from 'liwi-resources-server';

export interface DirectTransportClientOptions<AuthenticatedUser> {
  resourcesServerService: ResourcesServerService;
  authenticatedUser: AuthenticatedUser | null;
}

export const createVoidTransportClient = (): TransportClient => {
  const transportClient: TransportClient = {
    connect: () => {},
    close: () => {},
    listenStateChange: () => {
      return () => {};
    },
    send: (type, message) => {
      throw new Error('Void client: send should not be called');
    },

    subscribe: (type, messageWithoutSubscriptionId, callback) => {
      throw new Error('Void client: subscribe should not be called');
    },
  };

  return transportClient;
};
