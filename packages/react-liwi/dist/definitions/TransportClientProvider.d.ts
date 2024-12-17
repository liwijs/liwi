import type { ConnectionStates, TransportClient } from "liwi-resources-client";
import type { ReactNode } from "react";
export declare const TransportClientContext: import("react").Context<TransportClient>;
export declare const TransportClientStateContext: import("react").Context<ConnectionStates>;
export declare const TransportClientReadyContext: import("react").Context<boolean>;
export declare const useTransportClientState: () => ConnectionStates;
export declare const useTransportClientIsReady: () => boolean;
type TransportClientProviderProps<P extends Record<never, unknown>> = P & {
    createFn: (params: Omit<P, "children" | "createFn">) => TransportClient;
    children: ReactNode;
};
export declare function TransportClientProvider<P extends Record<never, unknown>>({ createFn, children, ...params }: TransportClientProviderProps<P>): ReactNode;
export {};
//# sourceMappingURL=TransportClientProvider.d.ts.map