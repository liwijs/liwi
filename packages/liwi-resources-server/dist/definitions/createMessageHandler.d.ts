import "pob-babel";
import type { QuerySubscription, ToServerMessage } from "liwi-resources";
import type { ResourcesServerService } from "./ResourcesServerService";
import type { SubscribeHook } from "./ServiceResource";
export type SubscriptionCallback = (subscriptionId: number, error: Error | null, result: any) => void;
export type MessageHandler = (message: ToServerMessage, subscriptionCallback: SubscriptionCallback) => Promise<unknown>;
export interface SubscriptionAndSubscribeHook {
    subscription: QuerySubscription;
    subscribeHook?: SubscribeHook<any>;
    params?: any;
}
export declare const createMessageHandler: <AuthenticatedUser>(resourcesServerService: ResourcesServerService, authenticatedUser: AuthenticatedUser | null, allowSubscriptions: boolean) => {
    messageHandler: MessageHandler;
    close: () => void;
};
//# sourceMappingURL=createMessageHandler.d.ts.map