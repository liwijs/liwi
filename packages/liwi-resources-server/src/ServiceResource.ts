import { AbstractQuery } from 'liwi-store';
import { QueryDescriptions, OperationDescriptions } from 'liwi-resources';

export interface SubscribeHook<ConnectedUser = any, P = any> {
  subscribed: (connectedUser: undefined | ConnectedUser, params: P) => void;
  unsubscribed: (connectedUser: undefined | ConnectedUser, params: P) => void;
}

export default interface ServiceResource<
  Queries extends QueryDescriptions,
  Operations extends OperationDescriptions = {},
  ConnectedUser = any
> {
  queries: {
    [P in keyof Queries]: (
      params: Queries[P]['params'],
      connectedUser: undefined | ConnectedUser,
    ) => AbstractQuery<Queries[P]['value']>
  };
  subscribeHooks?: {
    [P in keyof Queries]?: SubscribeHook<ConnectedUser, Queries[P]['params']>
  };
  operations: {
    [P in keyof Operations]: (
      params: Operations[P]['params'],
      connectedUser: undefined | ConnectedUser,
    ) => Promise<Operations[P]['result']>
  };
}
