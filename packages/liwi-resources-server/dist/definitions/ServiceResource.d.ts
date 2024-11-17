import type { ServiceInterface } from "liwi-resources";
export interface SubscribeHook<LoggedInUser = unknown, P = unknown> {
    subscribed: (loggedInUser: LoggedInUser | undefined, params: P) => void;
    unsubscribed: (loggedInUser: LoggedInUser | undefined, params: P) => void;
}
export interface ServiceResource<ClientService extends ServiceInterface<ClientService["queries"], ClientService["operations"]>, LoggedInUser = unknown> {
    queries: {
        [P in keyof ClientService["queries"]]: (params: Parameters<ClientService["queries"][P]>[0], loggedInUser: LoggedInUser | undefined) => Promise<ReturnType<ClientService["queries"][P]>> | ReturnType<ClientService["queries"][P]>;
    };
    subscribeHooks?: {
        [P in keyof ClientService["queries"]]?: SubscribeHook<LoggedInUser, Parameters<ClientService["queries"][P]>[0]>;
    };
    operations: {
        [P in keyof ClientService["operations"]]: (params: Parameters<ClientService["operations"][P]>[0], loggedInUser: LoggedInUser | undefined) => ReturnType<ClientService["operations"][P]>;
    };
}
//# sourceMappingURL=ServiceResource.d.ts.map