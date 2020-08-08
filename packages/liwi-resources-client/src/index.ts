import type { ServiceInterface, Query, QueryParams } from 'liwi-resources';
import ClientQuery from './ClientQuery';
import type { TransportClient } from './TransportClient';

export { ResourcesServerError } from 'liwi-resources';
export type {
  AckError,
  ToClientMessage,
  ToServerMessages,
  ToServerSubscribeMessages,
  ToServerQueryPayload,
  ToServerSubscribeQueryPayload,
  QuerySubscription,
  Query,
  QueryParams,
  QueryResult,
  QueryMeta,
  SubscribeCallback,
} from 'liwi-resources';
export type { default as ClientQuery } from './ClientQuery';
export type {
  TransportClient,
  TransportClientSubscribeCallback,
  TransportClientSubscribeResult,
  ConnectionStateChangeListener,
  ConnectionStateChangeListenerCreator,
  ConnectionStates,
} from './TransportClient';

const getKeys = <T extends {}>(o: T): (keyof T)[] =>
  Object.keys(o) as (keyof T)[];

interface CreateResourceClientOptions<
  QueryKeys extends keyof any,
  OperationKeys extends keyof any
> {
  queries: Record<QueryKeys, null>;
  operations: Record<OperationKeys, null>;
}

export type ServiceQuery<
  Result,
  Params extends QueryParams<Params> | undefined
> = (params: Params) => Query<Result, Params>;

export interface ClientServiceInterface<
  QueryKeys extends keyof any,
  OperationKeys extends keyof any
> extends ServiceInterface<QueryKeys, OperationKeys> {
  queries: {
    [key in QueryKeys]: ServiceQuery<any, any>;
  };
  operations: {
    [key in OperationKeys]: (params: any) => Promise<any>;
  };
}

export const createResourceClientService = <
  Service extends ClientServiceInterface<
    keyof Service['queries'],
    keyof Service['operations']
  >
>(
  resourceName: string,
  options: CreateResourceClientOptions<
    keyof Service['queries'],
    keyof Service['operations']
  >,
) => {
  return (transportClient: TransportClient): Service => {
    const queries: Partial<Service['queries']> = {};
    const operations: Partial<Service['operations']> = {};

    getKeys(options.queries).forEach((queryKey) => {
      queries[queryKey] = ((params: any) =>
        new ClientQuery(
          resourceName,
          transportClient,
          queryKey as string,
          params,
        )) as any;
    });

    getKeys(options.operations).forEach((operationKey) => {
      operations[operationKey] = ((params: any) =>
        transportClient.send('do', {
          resourceName,
          operationKey: operationKey as string,
          params,
        })) as any;
    });

    return ({
      queries,
      operations,
    } as unknown) as Service;
  };
};
