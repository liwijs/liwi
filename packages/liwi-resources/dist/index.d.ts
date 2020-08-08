import { ExtendedJsonValue } from 'extended-json';
import { Query, QueryParams } from 'liwi-store';
export type { Query, QuerySubscription, QueryParams, QueryResult, QueryMeta, SubscribeCallback, } from 'liwi-store';
export interface ResourceSubscribePayload<Options> {
    resourceName: string;
    type: string;
    args: Options;
}
export interface ServiceInterface<QueryKeys extends keyof any, OperationKeys extends keyof any> {
    queries: {
        [key in QueryKeys]: <Params extends QueryParams<Params>>(params: Params) => Query<any, Params>;
    };
    operations: {
        [key in OperationKeys]: (params: any) => Promise<any>;
    };
}
export declare type AckError = {
    code: string;
    message: string;
};
export declare type ToClientMessage<T = ExtendedJsonValue> = ['ack' | 'subscription', // type
number, // id
// id
AckError | null, // error
T];
export interface DoPayload {
    resourceName: string;
    operationKey: string;
    params: Record<string, ExtendedJsonValue> | undefined;
}
export interface ToServerQueryPayload {
    resourceName: string;
    key: string;
    params: Record<string, ExtendedJsonValue> | undefined;
}
export interface ToServerSubscribeQueryPayload extends ToServerQueryPayload {
    subscriptionId: number;
}
export interface ToServerSubscribeClose {
    subscriptionId: number;
}
declare type Message<RequestPayload, ResponsePayload> = [RequestPayload, ResponsePayload];
declare type SubscribeMessage<RequestPayload extends {
    params: Record<string, ExtendedJsonValue> | undefined;
}, ResponsePayload, SubscribeCallbackMessage> = [RequestPayload, ResponsePayload, SubscribeCallbackMessage];
export interface ToServerSimpleMessages {
    do: Message<DoPayload, undefined>;
    fetch: Message<ToServerQueryPayload, unknown>;
    'subscribe:close': Message<ToServerSubscribeClose, undefined>;
}
export interface ToServerSubscribeMessages<Params extends Record<keyof Params, ExtendedJsonValue> | undefined = never, Result = unknown> {
    subscribe: SubscribeMessage<ToServerSubscribeQueryPayload, undefined, Result>;
    fetchAndSubscribe: SubscribeMessage<ToServerSubscribeQueryPayload, undefined, Result>;
}
export declare type ToServerMessages = ToServerSimpleMessages & ToServerSubscribeMessages<Record<string, ExtendedJsonValue> | undefined>;
export declare type ToServerMessage = ({
    type: 'do';
    payload: ToServerSimpleMessages['do'][0];
} | {
    type: 'fetch';
    payload: ToServerSimpleMessages['fetch'][0];
} | {
    type: 'subscribe:close';
    payload: ToServerSimpleMessages['subscribe:close'][0];
} | {
    type: 'subscribe';
    payload: ToServerSubscribeMessages['subscribe'][0];
} | {
    type: 'fetchAndSubscribe';
    payload: ToServerSubscribeMessages['fetchAndSubscribe'][0];
}) & {
    id: number;
};
export declare class ResourcesServerError extends Error {
    code: string;
    constructor(code: string, message: string);
}
//# sourceMappingURL=index.d.ts.map