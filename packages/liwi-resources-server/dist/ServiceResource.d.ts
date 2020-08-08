import { ServiceInterface } from 'liwi-resources';
export interface SubscribeHook<ConnectedUser = any, P = any> {
    subscribed: (connectedUser: undefined | ConnectedUser, params: P) => void;
    unsubscribed: (connectedUser: undefined | ConnectedUser, params: P) => void;
}
export interface ServiceResource<ClientService extends ServiceInterface<ClientService['queries'], ClientService['operations']>, ConnectedUser = unknown> {
    queries: {
        [P in keyof ClientService['queries']]: (params: Parameters<ClientService['queries'][P]>[0], connectedUser: undefined | ConnectedUser) => ReturnType<ClientService['queries'][P]>;
    };
    subscribeHooks?: {
        [P in keyof ClientService['queries']]?: SubscribeHook<ConnectedUser, Parameters<ClientService['queries'][P]>[0]>;
    };
    operations: {
        [P in keyof ClientService['operations']]: (params: Parameters<ClientService['operations'][P]>[0], connectedUser: undefined | ConnectedUser) => ReturnType<ClientService['operations'][P]>;
    };
}
//# sourceMappingURL=ServiceResource.d.ts.map