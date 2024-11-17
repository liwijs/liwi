import type { ServiceInterface as ClientServiceInterface } from "liwi-resources";
import type { TransportClient } from "./TransportClient";
interface CreateResourceClientOptions<QueryKeys extends keyof any, OperationKeys extends keyof any> {
    queries: Record<QueryKeys, null>;
    operations: Record<OperationKeys, null>;
}
export declare const createResourceClientService: <Service extends ClientServiceInterface<Service["queries"], Service["operations"]>>(resourceName: string, options: CreateResourceClientOptions<keyof Service["queries"], keyof Service["operations"]>) => (transportClient: TransportClient) => Service;
export {};
//# sourceMappingURL=createResourceClientService.d.ts.map