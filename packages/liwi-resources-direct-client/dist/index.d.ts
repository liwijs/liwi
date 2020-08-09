import { TransportClient } from 'liwi-resources-client';
import { ResourcesServerService } from 'liwi-resources-server';
export interface DirectTransportClientOptions<AuthenticatedUser> {
    resourcesServerService: ResourcesServerService;
    authenticatedUser: AuthenticatedUser | null;
}
export declare const createDirectTransportClient: <AuthenticatedUser>({ resourcesServerService, authenticatedUser, }: DirectTransportClientOptions<AuthenticatedUser>) => TransportClient;
//# sourceMappingURL=index.d.ts.map