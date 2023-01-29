import type {
  TransportClient,
  TransportClientSubscribeResult,
} from 'liwi-resources-client';
import type { ResourcesServerService } from 'liwi-resources-server';
import { createMessageHandler } from 'liwi-resources-server';

export interface DirectTransportClientOptions<AuthenticatedUser> {
  resourcesServerService: ResourcesServerService;
  authenticatedUser: AuthenticatedUser | null;
}

export const createDirectTransportClient = <AuthenticatedUser>({
  resourcesServerService,
  authenticatedUser,
}: DirectTransportClientOptions<AuthenticatedUser>): TransportClient => {
  const { messageHandler, close } = createMessageHandler(
    resourcesServerService,
    authenticatedUser,
    false,
  );

  const transportClient: TransportClient = {
    connect: () => {},
    close,
    listenStateChange: () => {
      return () => {};
    },
    send: (type, message) => {
      return messageHandler({ type, id: 0, payload: message } as any, () => {
        throw new Error('Unsupported');
      }) as any;
    },

    subscribe: (type, messageWithoutSubscriptionId, callback) => {
      const message = { ...messageWithoutSubscriptionId, subscriptionId: 0 };

      const p: TransportClientSubscribeResult<any, any> = messageHandler(
        { type, id: 0, payload: message } as any,
        () => {},
      ).then(
        (result) => {
          callback(null, result as any);
        },
        (err) => {
          (callback as any)(err);
        },
      ) as any;

      p.stop = () => {};
      p.cancel = () => {};
      return p;
    },
  };

  return transportClient;
};
