import type { TransportClient } from "liwi-resources-client";
import type { ResourcesServerService } from "liwi-resources-server";
export interface DirectTransportClientOptions<AuthenticatedUser> {
    resourcesServerService: ResourcesServerService;
    authenticatedUser: AuthenticatedUser | null;
}
export declare const createVoidTransportClient: () => TransportClient;
//# sourceMappingURL=index.d.ts.map